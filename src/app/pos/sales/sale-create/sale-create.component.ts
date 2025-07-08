import { Component, OnDestroy, OnInit } from '@angular/core';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Observable, Subscription } from 'rxjs';
import { ImportsModule } from '../../../imports';
import { Point } from '../../../model/point';
import { Product } from '../../../model/product';
import { Order, OrderItem } from '../../../model/order';
import { PointService } from '../../../services/point.service';
import { ProductService } from '../../../services/product.service';
import { LoadingService } from '../../../services/util/loading.service';
import { OrderService } from '../../../services/order.service';
import { or } from 'firebase/firestore';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sale-create',
  imports: [ImportsModule],
  templateUrl: './sale-create.component.html',
  styleUrl: './sale-create.component.css'
})
export class SaleCreateComponent implements OnInit, OnDestroy{


  orders: { point: string; observable: Observable<Order[]> }[]   = []
  favoriteProducts: Product[] | undefined;
  private favoriteProductsSubscription: Subscription | undefined;
  points: Observable<Point[]> | undefined;

  activeIndex: number = 0;

  constructor(private pointService: PointService, private productService: ProductService, private orderService: OrderService, private loadingService: LoadingService, private messageService: MessageService) {
    this.points = this.pointService.findAll([{ field: 'name', direction: 'asc' }], [], []);
    this.favoriteProductsSubscription = this.productService.findAll([{ field: 'name', direction: 'asc' }], [{ field: 'favorite', operator: '==', value: true }], []).subscribe({
      next: (data)  => {
        this.favoriteProducts = data
      },
      error: (error) => {

      }
    });

    this.createPoints()

  }
  ngOnDestroy(): void {
    debugger;
    if(this.favoriteProductsSubscription){
      this.favoriteProductsSubscription.unsubscribe();
    }
    this.favoriteProducts = undefined;
    this.orders = [];
    this.points = undefined;

  }


  ngOnInit() {

  }

  createPoints() {

    this.points?.subscribe((data) => {
      data.forEach((point) => {

        const order = this.orderService.findDocument([{ field: 'point', operator: '==', value: point.id! }, { field: 'point', operator: '==', value: point.id! }, { field: 'state', operator: '==', value: 'open' }])
        order.subscribe(async (data) => {
          if (data) {
            this.orders.push({ point: point.id!, observable: this.orderService.findAll([], [{ field: 'point', operator: '==', value: data.point }], []) })
          } else {
            const resultCreate = await this.orderService.create({
              order: [],
              point: point.id!,
              state: 'open'
            })
            if (resultCreate) {
              this.orderService.findDocument([{ field: 'point', operator: '==', value: point.id! }, { field: 'point', operator: '==', value: point.id! }, { field: 'state', operator: '==', value: 'open' }])
                .subscribe((data) => {
                  this.orders.push({ point: point.id!, observable: this.orderService.findAll([], [{ field: 'point', operator: '==', value: data.point }], []) })
                })
            }
          }
        })
      })
    })

  }


  getOrderDetail(point: string): Observable<Order[]> | undefined {
    return this.orders.find((order) => order.point == point)?.observable
  }

  async addItem(pointId: string, product: Product) {
    this.orderService.findDocument([{ field: 'point', operator: '==', value: pointId }, { field: 'state', operator: '==', value: 'open' }]).subscribe(async (data: Order) => {


      if (data) {
        const order: Order = data

        const idx = order.order.findIndex((prod) => prod.item.id == product.id)

        if (idx != -1) {
          const item = order.order[idx]
          const itemUpdate: OrderItem = {
            item: product,
            quantity: item.quantity + 1
          }

          order.order.splice(idx, 1, itemUpdate)
          const resultUpdata = await this.orderService.update(order.id!, order)
          if (resultUpdata) {
            this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Pedido actualizado' });
          }
        } else {
          order.order.push({
            item: product,
            quantity: 1
          })

          const resultUpdata = await this.orderService.update(order.id!, order)
          if (resultUpdata) {
            this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Pedido actualizado' });
          }
        }

      }
    })

  }

  async deleteItem(pointId: string, product: Product) {
    this.orderService.findDocument([{ field: 'point', operator: '==', value: pointId }, { field: 'state', operator: '==', value: 'open' }]).subscribe(async (data: Order) => {


      if (data) {
        const order: Order = data

        const idx = order.order.findIndex((prod) => prod.item.id == product.id)

        if (idx != -1) {
          const item = order.order[idx]
          const itemUpdate: OrderItem = {
            item: product,
            quantity: item.quantity + 1
          }

          order.order.splice(idx, 1, itemUpdate)
          const resultUpdata = await this.orderService.update(order.id!, order)
          if (resultUpdata) {
            this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Pedido actualizado' });
          }
        } else {
          order.order.push({
            item: product,
            quantity: 1
          })

          const resultUpdata = await this.orderService.update(order.id!, order)
          if (resultUpdata) {
            this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Pedido actualizado' });
          }
        }

      }
    })

  }


  search($event: AutoCompleteCompleteEvent) {

    throw new Error('Method not implemented.');
  }
}
