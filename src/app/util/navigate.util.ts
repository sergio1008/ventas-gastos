import { Router } from "@angular/router";

export function navigate(router: Router, path: string){
    router.navigate([path]);
}
