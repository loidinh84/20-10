# 🌸 Website Chúc Mừng 20/10 & Thử Thách Nhận Lì Xì Tình Yêu

Website tương tác lãng mạn dành riêng cho ngày Phụ nữ Việt Nam 20/10 với giao diện Rose Glassmorphism hiện đại, hoa rơi bay bổng, thư tình, minigame thử thách dễ thương và hệ thống tạo mã **VietQR** nhận tiền lì xì trực tiếp!

---

## ✨ Các Tính Năng Nổi Bật

1. **Giao diện Rose Glassmorphism**: Sang trọng, lung linh, cánh hoa hồng rơi tự nhiên trên nền canvas mượt mà.
2. **Phong thư tình yêu 3D**: Chạm để mở nắp phong thư, phát nhạc tình yêu và đếm thời gian bên nhau (ngày, giờ, phút, giây).
3. **Thử thách tình yêu (Love Quest)**:
   - **Vòng 1**: Trắc nghiệm nịnh người yêu với nút troll *"Con mèo hàng xóm"* biết tự động chạy trốn khi chạm vào!
   - **Vòng 2**: Câu hỏi thấu hiểu tâm lý bạn gái siêu đáng yêu.
   - **Vòng 3**: Mở hộp quà bí mật với hiệu ứng pháo hoa bùng nổ.
4. **Bao Lì Xì 20/10 & Mã VietQR Tự Động**:
   - Tự động hiển thị mã **VietQR Napas247** với số tiền ý nghĩa (VD: `201,020 VNĐ`).
   - Bạn gái có thể quét trực tiếp để nhận tiền, hoặc bấm nút *"Gửi tin nhắn đòi ting ting"* qua Zalo/Messenger.
   - Hỗ trợ đổi số tài khoản/ngân hàng linh hoạt ngay trên web.
5. **Nút "Mã QR Web" có sẵn**: Giúp bạn trai dễ dàng tải hoặc quét mã QR của website để in lên thiệp giấy hoặc dán vào hộp quà tặng bạn gái.

---

## 🛠️ Hướng Dẫn Tùy Biến Nhanh (File `script.js`)

Mở file [`script.js`](file:///e:/Workspace/20-10/script.js), bạn sẽ thấy phần cấu hình ngay đầu file:

```javascript
const CONFIG = {
  // 1. Ngày hai bạn bắt đầu yêu nhau (để đếm ngày):
  startDate: "2024-02-14T00:00:00",

  // 2. Thông tin nhận lì xì mặc định:
  recipient: {
    bankId: "MB",               // Ngân hàng: MB, VCB, TCB, ACB, VPB, TPB, BIDV,...
    bankName: "MB Bank",        // Tên ngân hàng hiển thị
    accountNo: "0388888888",    // Số tài khoản của bạn gái (hoặc của bạn để quét)
    accountName: "EM BE DANG YEU", // Tên chủ tài khoản (viết hoa không dấu)
    amount: 201020,             // Số tiền lì xì (VD: 201020 hoặc 2010200 = 2.010.200đ)
    memo: "Chuc mung 20-10 em yeu" // Nội dung chuyển khoản
  }
};
```

---

## 🚀 Hướng Dẫn Đưa Lên Mạng Để Bạn Gái Ở Xa Xem Được

### 1. Có cần tạo Repository không?
* **Có**: Bạn nên tạo 1 GitHub Repository để lưu code và tự động đồng bộ lên hosting. Khi cần sửa lời chúc hay ảnh, chỉ cần sửa và push là web cập nhật ngay!

### 2. Cách Public Lên Hosting Miễn Phí (Nhanh nhất & Tốt nhất)

#### Cách A: Dùng Vercel (Khuyên Dùng Nhất ⭐⭐⭐⭐⭐)
* **Ưu điểm**: Mở trang tức thì (dưới 1 giây), không bao giờ bị "ngủ đông", tự động có HTTPS bảo mật để camera điện thoại quét mã QR mượt mà.
* **Các bước**:
  1. Tạo tài khoản miễn phí tại [vercel.com](https://vercel.com).
  2. Bấm **"Add New Project"** -> Chọn Repository GitHub của bạn.
  3. Bấm **"Deploy"**. Trong vòng 30 giây, bạn sẽ nhận được một đường link kiểu `https://ten-ban-gai-20-10.vercel.app`!

#### Cách B: Dùng Render (Như bạn hỏi)
* **Các bước**:
  1. Đăng ký tài khoản tại [render.com](https://render.com).
  2. Bấm **"New +"** -> Chọn **"Static Site"** (Không chọn Web Service vì web tĩnh không cần backend node/python).
  3. Kết nối với GitHub Repository của bạn.
  4. Phần **Publish directory**: Điền `./` hoặc để trống.
  5. Bấm **"Create Static Site"**. Bạn sẽ có link `https://xxx.onrender.com`.
  > *Lưu ý*: Với Static Site trên Render thì không bị ngủ đông như Web Service, nên chạy rất tốt!

#### Cách C: Dùng GitHub Pages (Không cần tài khoản bên ngoài)
1. Đẩy code lên GitHub.
2. Vào **Settings** của repository -> Chọn mục **Pages** ở cột trái.
3. Ở phần **Branch**, chọn `main` (hoặc `master`) rồi bấm **Save**.
4. Chờ 1-2 phút là bạn có link: `https://<ten-user>.github.io/<ten-repo>/`.

---

## 🎁 Cách Tạo Thiệp QR Gửi Bạn Gái

1. Sau khi deploy xong, bạn mở link web trên máy tính hoặc điện thoại.
2. Bấm vào biểu tượng **Mã QR** ở góc trên cùng bên phải màn hình.
3. Chụp lại ảnh mã QR đó, in lên một tấm thiệp hoặc gửi qua tin nhắn kèm lời nhắn:
   > *"Nhân ngày 20/10, anh có một bất ngờ bí mật dành riêng cho em. Em hãy mở camera điện thoại và quét mã QR này nhé!"* ❤️
