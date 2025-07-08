import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { deleteObject, getDownloadURL, ref, Storage, StorageError, StorageErrorCode, uploadBytes } from '@angular/fire/storage';
import imageCompression from 'browser-image-compression';
import { catchError, from, map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage, private auth: Auth) {

   }


   uploadImagen(file: File, nombreArchivo: string): Observable<string> {
    const options = {
      maxSizeMB: 0.5, // Tamaño máximo en MB
      maxWidthOrHeight: 600, // Ancho o alto máximo
      useWebWorker: true // Utilizar un Web Worker para mejorar el rendimiento
    };

    return from(imageCompression(file, options)).pipe(
      switchMap(compressedFile => {
        const storageRef = ref(this.storage, `/${this.auth.currentUser?.uid}/imagenes/` + nombreArchivo);
        return from(uploadBytes(storageRef, compressedFile)).pipe(
          switchMap(snapshot => from(getDownloadURL(snapshot.ref)))
        );
      })
    );
  }

  
  deleteFile(pathFile: string): Observable<void> {
    const archivoRef = ref(this.storage, pathFile);

    return from(deleteObject(archivoRef)).pipe(
      map(() => undefined), // Convierte el resultado en undefined
      catchError((error) => {
        if (error instanceof StorageError) {
          switch (error.code) {
            case StorageErrorCode.OBJECT_NOT_FOUND:
              console.error(`Archivo no encontrado en ${pathFile}.`);
              break;
            case StorageErrorCode.UNAUTHORIZED:
              console.error(`Usuario no autorizado para eliminar el archivo en ${pathFile}.`);
              break;
            default:
              console.error(`Error al eliminar el archivo: ${error.message}`);
          }
        } else {
          console.error("Error al eliminar el archivo:", error);
        }
        throw error;
      })
    );
  }


}
