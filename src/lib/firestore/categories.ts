import { randomUUID } from "crypto";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import type { FirestoreCategory } from "@/lib/types/database";
import {
  sortByNameHeAsc,
  sortBySortOrderAsc,
  toDate,
} from "@/lib/firestore/utils";

const COLLECTION = "categories";

function mapCategoryDoc(id: string, data: FirebaseFirestore.DocumentData): FirestoreCategory {
  return {
    id,
    slug: String(data.slug ?? ""),
    nameHe: String(data.nameHe ?? ""),
    nameEn: data.nameEn ?? null,
    description: data.description ?? null,
    parentId: data.parentId ?? null,
    imageUrl: data.imageUrl ?? null,
    icon: data.icon ?? null,
    sortOrder: Number(data.sortOrder ?? 0),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

export async function listCategories(): Promise<FirestoreCategory[]> {
  const snapshot = await getAdminDb().collection(COLLECTION).get();
  return sortBySortOrderAsc(snapshot.docs.map((doc) => mapCategoryDoc(doc.id, doc.data())));
}

export async function getCategoryById(id: string): Promise<FirestoreCategory | null> {
  const doc = await getAdminDb().collection(COLLECTION).doc(id).get();
  if (!doc.exists) {
    return null;
  }
  return mapCategoryDoc(doc.id, doc.data()!);
}

export async function getCategoryBySlug(slug: string): Promise<FirestoreCategory | null> {
  const snapshot = await getAdminDb()
    .collection(COLLECTION)
    .where("slug", "==", slug)
    .limit(1)
    .get();

  const doc = snapshot.docs[0];
  if (!doc) {
    return null;
  }

  return mapCategoryDoc(doc.id, doc.data());
}

export async function getCategoryBySlugConflict(slug: string, excludeId?: string) {
  const snapshot = await getAdminDb()
    .collection(COLLECTION)
    .where("slug", "==", slug)
    .limit(1)
    .get();

  const doc = snapshot.docs[0];
  if (!doc) {
    return null;
  }

  if (excludeId && doc.id === excludeId) {
    return null;
  }

  return mapCategoryDoc(doc.id, doc.data());
}

export async function listRootCategoriesForSelect() {
  const categories = await listCategories();
  return categories
    .filter((category) => !category.parentId)
    .map(({ id, nameHe }) => ({ id, nameHe }));
}

export async function listRootCategoriesForSelectExcluding(id: string) {
  const categories = await listCategories();
  return categories
    .filter((category) => !category.parentId && category.id !== id)
    .map(({ id: categoryId, nameHe }) => ({ id: categoryId, nameHe }));
}

export async function countCategories() {
  const snapshot = await getAdminDb().collection(COLLECTION).count().get();
  return snapshot.data().count;
}

export async function listCategoriesWithCounts() {
  const categories = await listCategories();
  return categories;
}

export async function listCategoriesForAdminTable() {
  const categories = await listCategories();
  const categoryMap = new Map(categories.map((category) => [category.id, category]));

  return categories.map((category) => ({
    ...category,
    parent: category.parentId ? categoryMap.get(category.parentId) ?? null : null,
  }));
}

export async function createCategory(data: {
  slug: string;
  nameHe: string;
  nameEn: string | null;
  description: string | null;
  parentId: string | null;
  imageUrl: string | null;
  icon: string | null;
  sortOrder: number;
}) {
  const id = randomUUID();
  const now = FieldValue.serverTimestamp();

  await getAdminDb()
    .collection(COLLECTION)
    .doc(id)
    .set({
      ...data,
      createdAt: now,
      updatedAt: now,
    });

  const created = await getCategoryById(id);
  if (!created) {
    throw new Error("Failed to create category");
  }

  return created;
}

export async function updateCategory(
  id: string,
  data: {
    slug: string;
    nameHe: string;
    nameEn: string | null;
    description: string | null;
    parentId: string | null;
    imageUrl: string | null;
    icon: string | null;
    sortOrder: number;
  },
) {
  await getAdminDb()
    .collection(COLLECTION)
    .doc(id)
    .update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });
}

export async function deleteCategoryById(id: string) {
  await getAdminDb().collection(COLLECTION).doc(id).delete();
}

export async function getChildCategories(parentId: string) {
  const snapshot = await getAdminDb()
    .collection(COLLECTION)
    .where("parentId", "==", parentId)
    .get();

  return snapshot.docs.map((doc) => mapCategoryDoc(doc.id, doc.data()));
}

export async function getAllCategorySlugs() {
  const categories = await listCategories();
  return categories.map((category) => category.slug);
}

export async function getCategoriesForSitemap() {
  const categories = await listCategories();
  return categories.map((category) => ({
    slug: category.slug,
    updatedAt: category.updatedAt,
  }));
}

export async function getCategorySelectOptions() {
  const categories = await listCategories();
  return sortByNameHeAsc(categories).map(({ id, nameHe }) => ({ id, nameHe }));
}

export async function getCategorySlugMap() {
  const categories = await listCategories();
  return new Map(categories.map((category) => [category.slug, category.id]));
}

export async function getCategoryIdMap() {
  const categories = await listCategories();
  return new Map(categories.map((category) => [category.id, category]));
}

export { mapCategoryDoc };
