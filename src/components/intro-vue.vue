<template>
  <div class="flex bg-white rounded-lg overflow-hidden">
    <div class="flex-1 p-8 space-y-4">
      <div class="text-2xl font-semibold mb-3">Tự tin mua sắm cùng TungShop</div>
      <div class="flex">
        <div class="space-y-3 w-1/2 p-3">
          <div class="flex items-center space-x-2">
            <component :is="ShieldCheck"></component>
            <div class="font-semibold">Chế độ bảo hành tận tâm</div>
          </div>
          <div class="text-sm">
            Tất cả các sản phẩm do TungShop bán ra đều được tuân thủ điều kiện bảo hành của nhà cung cấp, hãng sản xuất.
            Nếu có vấn đề về chất lượng sản phẩm, TungShop xin cam kết sẽ hỗ trợ Quý khách tới cùng.
          </div>
        </div>

        <div class="space-y-3 w-1/2 p-3">
          <div class="flex items-center space-x-2">
            <component :is="ArrowRepeat"></component>
            <div class="font-semibold">Hỗ trợ đổi trả hoàn tiền 100%</div>
          </div>
          <div class="text-sm">
            Với thời gian dùng thử lên tới 15 ngày, Quý khách sẽ được hỗ trợ đổi trả 1-1 hoặc hoàn tiền 100% nếu phát
            sinh lỗi hoặc cảm thấy sản phẩm chưa đáp ứng được nhu cầu.
          </div>
        </div>
      </div>
      <div class="space-y-3">
        <div class="flex space-x-2 items-center">
          <component :is="InfoCircle"></component>
          <div class="font-semibold">Thông tin hữu ích</div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div class="bg-fill rounded-lg px-5 py-2">
            <el-icon size="large">
              <i-ep-phone></i-ep-phone>
            </el-icon>
            <div>Hotline: 0379 000 135</div>
          </div>

          <div class="bg-fill rounded-lg px-5 py-2">
            <el-icon size="large">
              <i-ep-chat-line-round></i-ep-chat-line-round>
            </el-icon>
            <div>Email: tungpt244@gmail.com</div>
          </div>

          <div class="bg-fill rounded-lg px-5 py-2">
            <el-icon size="large">
              <i-ep-credit-card></i-ep-credit-card>
            </el-icon>
            <div>Chính sách thanh toán</div>
          </div>

          <div class="bg-fill rounded-lg px-5 py-2">
            <el-icon size="large">
              <i-ep-collection></i-ep-collection>
            </el-icon>
            <div>Chính sách giao hàng</div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-[240px] !bg-[url('/img/main-auth.png')] !bg-cover !bg-center !bg-no-repeat"></div>
  </div>
</template>

<script setup lang="ts">
import ShieldCheck from '@/assets/shield-check.svg'
import ArrowRepeat from '@/assets/arrow-repeat.svg'
import InfoCircle from '@/assets/info-circle.svg'
</script>
