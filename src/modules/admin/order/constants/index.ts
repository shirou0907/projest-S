enum ORDER_STATUS {
  TAT_CA = -1,
  CHO_DUYET = 0,
  DANG_XU_LY = 1,
  DA_HUY = 2,
  DA_HOAN_THANH = 3,
}

const ORDER_STATUS_DETAIL: Record<string, { label: string; name: string; color: string }> = {
  [ORDER_STATUS.TAT_CA]: { label: 'Tất cả', name: 'all', color: '' },
  [ORDER_STATUS.CHO_DUYET]: { label: 'Chờ duyệt', name: 'wait', color: 'warning' },
  [ORDER_STATUS.DANG_XU_LY]: { label: 'Đang xử lý', name: 'process', color: 'success' },
  [ORDER_STATUS.DA_HUY]: { label: 'Đã hủy', name: 'cancel', color: 'danger' },
  [ORDER_STATUS.DA_HOAN_THANH]: { label: 'Đã hoàn thành', name: 'complete', color: 'primary' },
}

export { ORDER_STATUS, ORDER_STATUS_DETAIL }
