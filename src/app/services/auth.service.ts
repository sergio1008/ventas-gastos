import { Injectable } from "@angular/core";
import { FirebaseApp } from "@angular/fire/app";
import { Auth, browserSessionPersistence, signInWithEmailAndPassword, signOut, UserCredential } from "@angular/fire/auth";
import { Functions, httpsCallable } from "@angular/fire/functions";
import { from, Observable, tap } from "rxjs";
import { User } from "../model/user";
@Injectable({
    providedIn: "root"
})
export class AuthService {

    constructor(private auth: Auth, private fns: Functions, private firebase: FirebaseApp) {

        
    }

    login(username: string, password: string): Observable<UserCredential> {
        return from(signInWithEmailAndPassword(this.auth, username, password)).pipe(tap(async (credencials: UserCredential) => {
            
            const idTokenResult = await credencials.user.getIdTokenResult();

            await this.auth.setPersistence(browserSessionPersistence)

            localStorage.setItem('token', idTokenResult.token)

            const claims: any = idTokenResult?.claims;

            const role = claims?.role;

            if (role) {
                localStorage.setItem('role', role);
                localStorage.setItem('companyId', claims?.companyId);
            } else {
                localStorage.setItem('role', 'admin');
                localStorage.setItem('companyId', credencials.user.uid);
            }

        }))
    }

    logout(): Observable<void> {
        return from(signOut(this.auth)).pipe(tap(() => {
            localStorage.removeItem('token')
            localStorage.removeItem('role');
            localStorage.removeItem('companyId');
        }))
    }


    createUser(user: User) {
        const createUserFn = httpsCallable(this.fns, "createUser")
        return from(createUserFn(user))
        
    }

    deleteUser(user: User){
        const deleteUserFn = httpsCallable(this.fns, "deleteUser")
        return from(deleteUserFn(user))
    }
}
