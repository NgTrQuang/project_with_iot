function calculateElectricityCost(kWh, tiers) {
    let totalCost = 0;
    let remainingKWh = kWh;
  
    for (const tier of tiers) {
      const [min, max] = tier.range; // Dải mức bậc thang
      const tierRate = tier.rate; // Đơn giá bậc thang
  
      if (remainingKWh <= 0) break; // Không còn kWh để tính
  
      if (max === Infinity || remainingKWh <= max - min) {
        // Nếu còn kWh nằm hoàn toàn trong bậc này
        totalCost += remainingKWh * tierRate;
        remainingKWh = 0; // Tiêu thụ hết
      } else if (min === 0){
        // Nếu kWh vượt qua bậc này
        totalCost += max * tierRate;
        remainingKWh -= max; // Trừ kWh đã tính
      } else {
        // Nếu kWh vượt qua bậc này
        const tierUsage = max - min + 1; // Số kWh trong bậc
        totalCost += tierUsage * tierRate;
        remainingKWh -= tierUsage; // Trừ kWh đã tính
      }
    }
  
    return totalCost;
  }
  
  // Ví dụ sử dụng:
  const tiers = [
    { range: [0, 50], rate: 1893 }, // Giá mới
    { range: [51, 100], rate: 1956 },
    { range: [101, 200], rate: 2271 },
    { range: [201, 300], rate: 2860 },
    { range: [301, 400], rate: 3197 },
    { range: [401, Infinity], rate: 3302 },
  ];
  
  const kWh = 410; // Số kWh tiêu thụ
  console.log(`Tổng tiền điện: ${calculateElectricityCost(kWh, tiers)} đồng`);
  