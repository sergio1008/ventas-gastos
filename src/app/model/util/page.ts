import { QueryDocumentSnapshot } from "@angular/fire/firestore";

export interface Page<T> {
    content: T[],
    lastReference: QueryDocumentSnapshot<T>  | null,
    totalElementos: number,
    page: number
}
