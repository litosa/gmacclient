import { Directive, Input } from '@angular/core';

@Directive({
  selector: 'img-custom',
  host: {
    '(error)': 'updateUrl()',
    '[src]': 'src'
  }
})
export class DefaultImageDirective {

  @Input() src: string;
  @Input() default: string;

  updateUrl() {
    this.src = '../../assets/img/default-user.png'
  }
}