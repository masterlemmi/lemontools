
import { Directive, HostBinding, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[appMenu]',
  exportAs: 'appMenu'
})
export class MenuDirective {

   toggled: boolean = false;

  constructor(private el: ElementRef, private renderer : Renderer2, private router: Router) {
  }

  toggle(){
    
    if (this.toggled){
      this.renderer.removeClass(this.el.nativeElement, 'is-active');
    } else {
      this.renderer.addClass(this.el.nativeElement, 'is-active');
    }

    this.toggled = !this.toggled;
    
  }

  nav(route){

    const rte = [route];
    this.router.navigate(rte)
    this.toggle();
  }
}