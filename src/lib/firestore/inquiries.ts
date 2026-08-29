import { randomUUID } from "crypto";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import {
  getCategoryById,
  getCategoryIdMap,
  getCategorySlugMap,
} from "@/lib/firestore/categories";
import {
  includesQuery,
  paginateArray,
  sortByDateDesc,
  sortByNameHeAsc,
  sortBySortOrderAsc,
  sortByViewCountDesc,
  toDate,
} from "@/lib/firestore/utils";
import type {
  FirestoreInquiry,
  InquirySource,
  InquiryStatus,
} from "@/lib/types/database";

const COLLECTION = "inquiries";

function mapInquiryDoc(id: string, data: FirebaseFirestore.DocumentData): FirestoreInquiry {
  return {
    id,
    name: String(data.name ?? ""),
    phone: String(data.phone ?? ""),
    email: data.email ?? null,
    message: data.message ?? null,
    productId: data.productId ?? null,
    source: (data.source ?? "contact_form") as InquirySource,
    status: (data.status ?? "new") as InquiryStatus,
    createdAt: toDate(data.createdAt),
  };
}

export async function createInquiry(data: {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  productId?: string;
  source?: InquirySource;
}) {
  const id = randomUUID();

  await getAdminDb()
    .collection(COLLECTION)
    .doc(id)
    .set({
      name: data.name,
      phone: data.phone,
      email: data.email ?? null,
      message: data.message ?? null,
      productId: data.productId ?? null,
      source: data.source ?? "contact_form",
      status: "new",
      createdAt: FieldValue.serverTimestamp(),
    });

  return { id };
}

export async function listInquiries() {
  const snapshot = await getAdminDb().collection(COLLECTION).get();
  return sortByDateDesc(snapshot.docs.map((doc) => mapInquiryDoc(doc.id, doc.data())));
}

export async function countNewInquiries() {
  const snapshot = await getAdminDb()
    .collection(COLLECTION)
    .where("status", "==", "new")
    .count()
    .get();

  return snapshot.data().count;
}

export async function updateInquiryStatus(id: string, status: InquiryStatus) {
  await getAdminDb().collection(COLLECTION).doc(id).update({ status });
}

export async function getRecentInquiries(limit = 5) {
  const inquiries = await listInquiries();
  return inquiries.slice(0, limit);
}
