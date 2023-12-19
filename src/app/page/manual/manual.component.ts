import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.scss']
})
export class ManualComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // เลือก iframe โดยใช้ ID ของ iframe
  var iframe :any= document.getElementById('myIframe');

  // ฟังก์ชันสำหรับการเปลี่ยนขนาด
  function setZoom(scale:any) {
    iframe.style.transform = 'scale(' + scale / 100 + ')';
  }

  // เรียกใช้ฟังก์ชัน setZoom โดยส่งค่าขนาดที่ต้องการ
  setZoom(100); // 100% zoom level
  }

}
