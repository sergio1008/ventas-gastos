import { Routes } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoadingService } from './services/util/loading.service';
import { PageNotFoundComponent } from './template/page-not-found/page-not-found.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/auth',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        children: [
            { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
            {
                path: 'login',
                loadComponent: () => import('./Auth/login/login.component').then(a => a.LoginComponent),
            }
        ]
    },

    {
        path: 'pos',
        loadComponent: () => import('./pos/pos.component').then(a => a.PosComponent),
        providers: [MessageService, LoadingService],
        children: [
            { path: '', redirectTo: '/pos/dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () => import('./pos/dashboard/dashboard.component').then(a => a.DashboardComponent),
            },
            {
                path: 'productos',
                canActivate: [adminGuard],
                loadComponent: () => import('./pos/product/product.component').then(a => a.ProductComponent),
                children: [
                    { path: '', redirectTo: '/pos/productos/listar', pathMatch: 'full' },
                    {
                        path: 'listar',
                        loadComponent: () => import('./pos/product/product-list/product-list.component').then(a => a.ProductListComponent),
                    },
                    {
                        path: 'crear',
                        loadComponent: () => import('./pos/product/product-create/product-create.component').then(a => a.ProductCreateComponent),
                    },
                    {
                        path: 'editar:id',
                        loadComponent: () => import('./pos/product/product-edit/product-edit.component').then(a => a.ProductEditComponent),
                    },
                    {
                        path: 'detalle:id',
                        loadComponent: () => import('./pos/product/product-detail/product-detail.component').then(a => a.ProductDetailComponent),
                    },
                ]
            },
            {
                path: 'puntos',
                loadComponent: () => import('./pos/point/point.component').then(a => a.PointComponent),
                children: [
                    { path: '', redirectTo: '/pos/puntos/listar', pathMatch: 'full' },
                    {
                        path: 'listar',
                        loadComponent: () => import('./pos/point/point-list/point-list.component').then(a => a.PointListComponent),
                    },
                    {
                        path: 'crear',
                        loadComponent: () => import('./pos/point/point-create/point-create.component').then(a => a.PointCreateComponent),
                    }
                ]
            },
            {
                path: 'usuarios',
                canActivate: [adminGuard],
                loadComponent: () => import('./Auth/user/user.component').then(a => a.UserComponent),
                providers: [MessageService, LoadingService],
                children: [
                    { path: '', redirectTo: '/pos/usuarios/listar', pathMatch: 'full' },
                    {
                        path: 'listar',
                        loadComponent: () => import('./Auth/user/user-list/user-list.component').then(a => a.UserListComponent),
                    },
                    {
                        path: 'crear',
                        loadComponent: () => import('./Auth/user/user-create/user-create.component').then(a => a.UserCreateComponent),
                    }
                ]
            },
            {
                path: 'ventas',
                loadComponent: () => import('./pos/sales/sales.component').then(a => a.SalesComponent),
                children: [
                    { path: '', redirectTo: '/pos/ventas/crear', pathMatch: 'full' },
                    {
                        path: 'crear',
                        loadComponent: () => import('./pos/sales/sale-create/sale-create.component').then(a => a.SaleCreateComponent),
                    },
                    {
                        path: 'listar',
                        loadComponent: () => import('./pos/sales/sale-list/sale-list.component').then(a => a.SaleListComponent),
                    }
                ]
            }
        ]
    },

    { path: '**', component: PageNotFoundComponent },

];
