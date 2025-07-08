import { Auth } from "@angular/fire/auth";
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, getDoc, limit, orderBy, query, setDoc, startAfter, where } from "@angular/fire/firestore";
import { DocumentData, endBefore, Firestore, getDocs, QueryDocumentSnapshot, QueryFieldFilterConstraint, QueryOrderByConstraint } from "firebase/firestore";
import { catchError, forkJoin, from, map, Observable, of } from "rxjs";
import { Page } from "../model/util/page";
import { Filter } from "./util/filter";
import { Like } from "./util/like";
import { OrderBy } from "./util/orderBy";


export class CrudService<T extends DocumentData> {

  itemCollection: CollectionReference<T, T>
  uid: string | undefined 

  constructor(private firestore: Firestore, private collectionName: string) {
    debugger;
    const companyID = localStorage.getItem('companyId');
    this.itemCollection = collection(this.firestore, `${this.collectionName}/${companyID}/${this.collectionName}`) as CollectionReference<T, T>;
  }


  async create(model: T): Promise<boolean> {
    try {
      const result = await addDoc(this.itemCollection, model);
      if (result.id != null) {
        return true;
      }
    } catch (error) {
      console.error('Error al agregar el producto:', error);
    }
    return false;
  }

  async findOne(){
    
  }


  findDocument(filter: Filter[]): Observable<T> {
    const filterArray: QueryFieldFilterConstraint[] = filter.map(element => where(element.field, element.operator, element.value));
    const q = query(this.itemCollection, ...filterArray);
    return from(getDocs(q)).pipe(
      map(querySnapshot => {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as T;
      }),
      catchError(error => {
        console.error('Error al obtener el documento:', error);
        return of(null as unknown as T);
      })
    );
  }




  async update( idDocumento: string, document:T): Promise<boolean> {
    const documentoRef = doc(this.itemCollection, idDocumento);
  
    try {
      await setDoc(documentoRef, document);
      console.log("Documento actualizado con éxito");
      return true
    } catch (error) {
      console.error("Error al actualizar el documento:", error);
      return false
    }
  }

  find(page: number, size: number = 20, order: OrderBy[], filter: Filter[], direction: 'next' | 'previous' | null = null, reference: QueryDocumentSnapshot<T> | null, like: Like[]): Observable<Page<T>> {

    const orderByArray: QueryOrderByConstraint[] = order.map(element => orderBy(element.field, element.direction));
    const filterArray: QueryFieldFilterConstraint[] = filter.map(element => where(element.field, element.operator, element.value))
    const likeArray: QueryFieldFilterConstraint[] = [];

    like.forEach(element => {
      likeArray.push(where(element.field, '>=', element.value));
      likeArray.push(where(element.field, '<=', element.value + '\uf8ff'));
    });


    let q = null;
    if (direction === 'next') {
      q = query(this.itemCollection, ...filterArray, ...likeArray ,...orderByArray, startAfter(reference), limit(size));
  } else if (direction === 'previous') {
      const reversedOrderByArray: QueryOrderByConstraint[] = order.map(element => orderBy(element.field, element.direction === 'asc' ? 'desc' : 'asc'));
      q = query(this.itemCollection, ...filterArray, ...reversedOrderByArray, ... likeArray, endBefore(reference), limit(size));
  } else {
      q = query(this.itemCollection, ...filterArray,... likeArray, ...orderByArray, limit(size));
  }

    const queryPaged = from(getDocs(q!));
    const queryTotal = this.countModels( orderByArray, filterArray);

    return forkJoin([queryPaged, queryTotal]).pipe(
      map(([querySnapshot, totalElementos]) => {
        const content: T[] = [];
        let lastReference: QueryDocumentSnapshot<T> | null = null;

        querySnapshot.forEach((doc) => {
          content.push({ id: doc.id, ...doc.data() });
        });


        if (direction === 'next' || direction === null) {
          lastReference = querySnapshot.docs[querySnapshot.docs.length - 1];
      } else if (direction === 'previous') {
          lastReference = querySnapshot.docs[0];
      }

      const finalContent = direction === 'previous' ? content.reverse() : content;

        return {   content: finalContent, totalElementos, page, lastReference: lastReference };
      }),
      catchError((error) => {
        console.error("Error al paginar consulta:", error);
        return of({ content: [], lastReference: null, totalElementos: 0, page: 0 });
      })
    );

  }



  

  countModels(order: QueryOrderByConstraint[], filter: QueryFieldFilterConstraint[]  ): Observable<number> {
    const q = query(this.itemCollection, ...order, ...filter);
    return from(getDocs(q)).pipe(
      map((querySnapshot) => querySnapshot.size),
      catchError((error) => {
        console.error("Error al contar productos:", error);
        return of(0);
      })
    );
  }


  deleteDocumentById( documentId: string,): Observable<void> {
    const documentRef = doc(this.firestore, `${this.collectionName}/${this.uid}/${this.collectionName}`, documentId);
    return from(deleteDoc(documentRef));
  }

  findAll(order : OrderBy[], filter : Filter[], like: Like[]): Observable<T[]> {
    const orderByArray: QueryOrderByConstraint[] = order.map(element => orderBy(element.field, element.direction));
    const filterArray: QueryFieldFilterConstraint[] = filter.map(element => where(element.field, element.operator, element.value))

    const likeArray: QueryFieldFilterConstraint[] = [];

    like.forEach(element => {
      likeArray.push(where(element.field, '>=', element.value));
      likeArray.push(where(element.field, '<=', element.value + '\uf8ff'));
    });
    return collectionData(query(this.itemCollection, ...filterArray, ...orderByArray, ...likeArray), { idField: 'id' }) as Observable<T[]>;
  }

}