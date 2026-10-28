# การเงินธุรกิจ (Business Finance) — Interactive Lecture

เว็บสื่อการสอนแบบโต้ตอบ แยกตามบท  โครงสร้าง:

```
index.html            หน้าแรก (รายการ 12 บท)
shared/               สไตล์ ตัวเลื่อนสไลด์ ชุดเกมกลาง โลโก้ (ใช้ร่วมทุกบท)
ch1-overview/         บทที่ 1 (index.html + ch1.js)
```

## เปิดบนอินเทอร์เน็ตด้วย GitHub Pages (ฟรี)
1. สร้าง repository ใหม่ (Public) ใน GitHub เช่น `business-finance`
2. อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้ (Add file → Upload files)
3. Settings → Pages → Source: Deploy from a branch → Branch: `main` / `(root)` → Save
4. รอประมาณ 1–2 นาที ที่อยู่เว็บจะเป็น `https://<ชื่อผู้ใช้>.github.io/business-finance/`

## เพิ่มบทใหม่
คัดลอกโฟลเดอร์ `ch1-overview` เป็น `ch2-...` แก้สไลด์ใน `index.html` และเกมใน `ch2.js`
(ใช้ชุดเกมกลางใน `shared/games.js` ได้: sort, quiz, match, tally, fills, range)
แล้วเปลี่ยนการ์ดบทนั้นในหน้าแรกจาก `div.off` เป็นลิงก์ `a.on`

ระบบนี้ไม่เก็บข้อมูลนักศึกษาหรือคะแนนใด ๆ

## โหมดอาจารย์ / ให้นักศึกษาตามหน้า (Supabase Realtime)
1. สร้างโปรเจกต์ฟรีที่ supabase.com แล้วคัดลอก Project URL และ anon/publishable key (Project Settings > API)
2. เปิด https://wisuttorn.github.io/Finance211/host-setup.html กรอก URL, key และตั้งรหัสผ่านอาจารย์ แล้วกดสร้าง จะได้ไฟล์ sync-config.js
3. อัปโหลดไฟล์นั้นไปไว้ในโฟลเดอร์ shared (ทับไฟล์เดิม)
4. เวลาสอน เปิดลิงก์บทนั้นต่อท้ายด้วย ?host เช่น .../ch1-overview/?host แล้วกด "เริ่มถ่ายทอด" ใส่รหัสผ่าน
5. นักศึกษาเปิดลิงก์ปกติ จะเห็นปุ่ม "ตามอาจารย์" เมื่ออาจารย์กำลังสอน
บทใหม่ใส่ <script src="../shared/sync-config.js"></script> และ <script src="../shared/sync.js"></script> ท้ายหน้าเหมือนบทที่ 1
