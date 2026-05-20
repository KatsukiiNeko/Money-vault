export const translations = {
  // ── App ──
  'app.copyright': {
    en: 'Katsukii Neko. All rights reserved.',
    vi: 'Katsukii Neko. All rights reserved.'
  },

  // ── LockScreen ──
  'lock.title': {
    en: 'Money Vault',
    vi: 'Money Vault'
  },
  'lock.subtitle': {
    en: 'Secure Personal Finance Tracker',
    vi: 'Trình quản lý tài chính cá nhân'
  },
  'lock.enterPassword': {
    en: 'Enter Password:',
    vi: 'Nhập mật khẩu:'
  },
  'lock.passwordPlaceholder': {
    en: 'Enter your PIN or password',
    vi: 'Nhập mã PIN hoặc mật khẩu'
  },
  'lock.unlock': {
    en: 'Unlock',
    vi: 'Mở khóa'
  },
  'lock.setPassword': {
    en: 'Set Password',
    vi: 'Cài đặt mật khẩu'
  },
  'lock.errors.emptyPassword': {
    en: 'Please enter a password',
    vi: 'Vui lòng nhập mật khẩu'
  },
  'lock.errors.tooShort': {
    en: 'Password must be at least 4 characters',
    vi: 'Mật khẩu phải có ít nhất 4 kí tự'
  },
  'lock.errors.locked': {
    en: 'Account is temporarily locked. Please try again later.',
    vi: 'Tài khoản tạm thời bị khóa, vui lòng thử lại sau'
  },
  'lock.errors.corrupted': {
    en: 'Corrupted data. Please reset the app.',
    vi: 'Dữ liệu bị lỗi, hãy khởi động lại ứng dụng'
  },
  'lock.errors.invalid': {
    en: 'Invalid password',
    vi: 'Sai mật khẩu'
  },
  'lock.errors.tooManyAttempts': {
    en: 'Too many failed attempts. Locked for 30 seconds.',
    vi: 'Quá số lần sai mật khẩu, bị khóa trong 30 giây'
  },
  'lock.errors.unlockFailed': {
    en: 'Failed to unlock. Please try again.',
    vi: 'Không thể mở khóa, hãy thử lại sau'
  },
  'lock.lockoutTimer': {
    en: 'Account locked. Try again in: {seconds}s',
    vi: 'Tài khoản bị khóa, thử lại sau: {seconds}s'
  },
  'lock.info.encrypted': {
    en: 'Your financial data is encrypted and stored locally on your device.',
    vi: 'Dữ liệu đã được mã hóa và lưu trữ trên thiết bị của bạn'
  },
  'lock.info.noServer': {
    en: 'No data is sent to any server.',
    vi: 'Không dữ liệu nào được gửi đến máy chủ'
  },

  // ── Dashboard ──
  'dashboard.title': {
    en: 'Money Vault',
    vi: 'Money Vault'
  },
  'dashboard.lock': {
    en: 'Lock',
    vi: 'Khóa'
  },
  'dashboard.totalBalance': {
    en: 'Total Balance',
    vi: 'Tổng số tiền'
  },
  'dashboard.income': {
    en: 'Income',
    vi: 'Nguồn tiền vào'
  },
  'dashboard.expenses': {
    en: 'Expenses',
    vi: 'Nguồn tiền ra'
  },
  'dashboard.sessionExpired': {
    en: 'Session expired',
    vi: 'Phiên đăng nhập đã hết hạn'
  },
  'dashboard.noFileSelected': {
    en: 'No file selected',
    vi: 'Không có tệp nào được chọn'
  },
  'dashboard.invalidBackupFormat': {
    en: 'Invalid backup file format',
    vi: 'Định dạng tệp sao lưu không hợp lệ'
  },
  'dashboard.invalidBackupData': {
    en: 'Invalid backup data structure',
    vi: 'Cấu trúc dữ liệu sao lưu không hợp lệ'
  },
  'dashboard.restoreFailed': {
    en: 'Failed to restore: ',
    vi: 'Khôi phục thất bại: '
  },

  'form.title': {
    en: 'Add Transaction',
    vi: 'Thêm giao dịch'
  },
  'form.date': {
    en: 'Date:',
    vi: 'Ngày:'
  },
  'form.type': {
    en: 'Type:',
    vi: 'Loại:'
  },
  'form.expense': {
    en: 'Expense',
    vi: 'Chi tiêu'
  },
  'form.income': {
    en: 'Income',
    vi: 'Thu nhập'
  },
  'form.category': {
    en: 'Category:',
    vi: 'Danh mục:'
  },
  'form.selectCategory': {
    en: 'Select a category',
    vi: 'Chọn danh mục'
  },
  'form.amount': {
    en: 'Amount:',
    vi: 'Số tiền:'
  },
  'form.note': {
    en: 'Note:',
    vi: 'Ghi chú:'
  },
  'form.notePlaceholder': {
    en: 'Optional note',
    vi: 'Ghi chú (tùy chọn)'
  },
  'form.submit': {
    en: 'Add Transaction',
    vi: 'Thêm giao dịch'
  },
  'form.errors.invalidAmount': {
    en: 'Please enter a valid amount',
    vi: 'Vui lòng nhập số tiền hợp lệ'
  },
  'form.errors.selectCategory': {
    en: 'Please select a category',
    vi: 'Vui lòng chọn danh mục'
  },
  'form.errors.sessionExpired': {
    en: 'Session expired. Please unlock again.',
    vi: 'Phiên đăng nhập đã hết hạn. Vui lòng mở khóa lại.'
  },
  'form.success.added': {
    en: 'Transaction added successfully!',
    vi: 'Thêm giao dịch thành công!'
  },
  'form.errors.addFailed': {
    en: 'Failed to add transaction. Please try again.',
    vi: 'Thêm giao dịch thất bại. Vui lòng thử lại.'
  },

  // ── Categories ──
  'cat.foodDining': {
    en: 'Food & Dining',
    vi: 'Đồ ăn & Ăn uống'
  },
  'cat.transportation': {
    en: 'Transportation',
    vi: 'Di chuyển'
  },
  'cat.shopping': {
    en: 'Shopping',
    vi: 'Mua sắm'
  },
  'cat.entertainment': {
    en: 'Entertainment',
    vi: 'Giải trí'
  },
  'cat.billsUtilities': {
    en: 'Bills & Utilities',
    vi: 'Hóa đơn & Tiện ích'
  },
  'cat.healthcare': {
    en: 'Healthcare',
    vi: 'Sức khỏe'
  },
  'cat.travel': {
    en: 'Travel',
    vi: 'Du lịch'
  },
  'cat.education': {
    en: 'Education',
    vi: 'Giáo dục'
  },
  'cat.giftsDonations': {
    en: 'Gifts & Donations',
    vi: 'Quà tặng & Quyên góp'
  },
  'cat.salary': {
    en: 'Salary',
    vi: 'Lương'
  },
  'cat.investment': {
    en: 'Investment',
    vi: 'Đầu tư'
  },
  'cat.otherIncome': {
    en: 'Other Income',
    vi: 'Thu nhập khác'
  },

  // ── History ──
  'history.title': {
    en: 'Transaction History',
    vi: 'Lịch sử giao dịch'
  },
  'history.loading': {
    en: 'Loading transactions...',
    vi: 'Đang tải giao dịch...'
  },
  'history.empty': {
    en: 'No transactions found.',
    vi: 'Không tìm thấy giao dịch nào.'
  },
  'history.errors.sessionExpired': {
    en: 'Session expired. Please unlock again.',
    vi: 'Phiên đăng nhập đã hết hạn. Vui lòng mở khóa lại.'
  },
  'history.errors.loadFailed': {
    en: 'Failed to load transactions',
    vi: 'Tải giao dịch thất bại'
  },

  // ── Forecast ──
  'forecast.title': {
    en: 'Monthly Forecast',
    vi: 'Dự báo theo tháng'
  },
  'forecast.loading': {
    en: 'Loading forecast data...',
    vi: 'Đang tải dữ liệu dự báo...'
  },
  'forecast.noData': {
    en: 'No data available',
    vi: 'Không có dữ liệu'
  },
  'forecast.currentBalance': {
    en: 'Current Balance:',
    vi: 'Số dư hiện tại:'
  },
  'forecast.projectedBalance': {
    en: 'Projected End-of-Month Balance:',
    vi: 'Số dư dự kiến cuối tháng:'
  },
  'forecast.dailyAverage': {
    en: 'Daily Average Spending:',
    vi: 'Chi tiêu trung bình mỗi ngày:'
  },
  'forecast.daysRemaining': {
    en: 'Days Remaining:',
    vi: 'Số ngày còn lại:'
  },
  'forecast.perDay': {
    en: '/day',
    vi: '/ngày'
  },
  'forecast.days': {
    en: 'days',
    vi: 'ngày'
  },

  // ── PasswordManager ──
  'password.toggleLabel': {
    en: 'Change Password',
    vi: 'Đổi mật khẩu'
  },
  'password.currentLabel': {
    en: 'Current Password',
    vi: 'Mật khẩu hiện tại'
  },
  'password.currentPlaceholder': {
    en: 'Enter current password',
    vi: 'Nhập mật khẩu hiện tại'
  },
  'password.newLabel': {
    en: 'New Password',
    vi: 'Mật khẩu mới'
  },
  'password.newPlaceholder': {
    en: 'Enter new password',
    vi: 'Nhập mật khẩu mới'
  },
  'password.confirmLabel': {
    en: 'Confirm New Password',
    vi: 'Xác nhận mật khẩu mới'
  },
  'password.confirmPlaceholder': {
    en: 'Confirm new password',
    vi: 'Xác nhận mật khẩu mới'
  },
  'password.update': {
    en: 'Update Password',
    vi: 'Cập nhật mật khẩu'
  },
  'password.reEncrypting': {
    en: 'Re-encrypting...',
    vi: 'Đang mã hóa lại...'
  },
  'password.errors.required': {
    en: 'All fields are required',
    vi: 'Vui lòng điền đầy đủ thông tin'
  },
  'password.errors.mismatch': {
    en: 'New passwords do not match',
    vi: 'Mật khẩu mới không khớp'
  },
  'password.errors.tooShort': {
    en: 'New password must be at least 4 characters',
    vi: 'Mật khẩu mới phải có ít nhất 4 kí tự'
  },
  'password.errors.notSet': {
    en: 'No password has been set yet',
    vi: 'Chưa cài đặt mật khẩu'
  },
  'password.errors.incorrect': {
    en: 'Current password is incorrect',
    vi: 'Mật khẩu hiện tại không đúng'
  },
  'password.errors.decryptFailed': {
    en: 'Failed to decrypt some transactions. Aborting password change.',
    vi: 'Không thể giải mã một số giao dịch. Hủy đổi mật khẩu.'
  },
  'password.success.changed': {
    en: 'Password changed successfully. All data re-encrypted.',
    vi: 'Đổi mật khẩu thành công. Dữ liệu đã được mã hóa lại.'
  },
  'password.errors.changeFailed': {
    en: 'Failed to change password: ',
    vi: 'Đổi mật khẩu thất bại: '
  },

  // ── BackupRestore ──
  'backup.title': {
    en: 'Backup & Restore',
    vi: 'Sao lưu & Khôi phục'
  },
  'backup.backupBtn': {
    en: 'Backup Data',
    vi: 'Sao lưu dữ liệu'
  },
  'backup.backupBtnLoading': {
    en: 'Backing up...',
    vi: 'Đang sao lưu...'
  },
  'backup.restoreBtn': {
    en: 'Restore Data',
    vi: 'Khôi phục dữ liệu'
  },
  'backup.restoreBtnLoading': {
    en: 'Restoring...',
    vi: 'Đang khôi phục...'
  },
  'backup.creating': {
    en: 'Creating backup...',
    vi: 'Đang tạo bản sao lưu...'
  },
  'backup.success': {
    en: 'Backup created successfully!',
    vi: 'Tạo bản sao lưu thành công!'
  },
  'backup.failedPrefix': {
    en: 'Backup failed: ',
    vi: 'Sao lưu thất bại: '
  },
  'backup.confirmRestore': {
    en: 'Restoring will replace all current data. Continue?',
    vi: 'Khôi phục sẽ thay thế toàn bộ dữ liệu hiện tại. Tiếp tục?'
  },
  'backup.restoreStarted': {
    en: 'Restore started...',
    vi: 'Bắt đầu khôi phục...'
  },
  'backup.restoreSuccess': {
    en: 'Restore completed successfully!',
    vi: 'Khôi phục thành công!'
  },
  'backup.failedRestorePrefix': {
    en: 'Restore failed: ',
    vi: 'Khôi phục thất bại: '
  },

  // ── Account Selector ──
  'accounts.title': {
    en: 'Money Vault',
    vi: 'Money Vault'
  },
  'accounts.selectPrompt': {
    en: 'Select an account',
    vi: 'Chọn tài khoản'
  },
  'accounts.create': {
    en: 'Create New Account',
    vi: 'Tạo tài khoản mới'
  },
  'accounts.createName': {
    en: 'Account Name',
    vi: 'Tên tài khoản'
  },
  'accounts.createNamePlaceholder': {
    en: 'e.g. Personal, Business',
    vi: 'vd: Cá nhân, Kinh doanh'
  },
  'accounts.createBtn': {
    en: 'Create Account',
    vi: 'Tạo tài khoản'
  },
  'accounts.delete': {
    en: 'Delete Account',
    vi: 'Xóa tài khoản'
  },
  'accounts.deleteConfirm': {
    en: 'Delete "{name}"? All transactions will be permanently deleted.',
    vi: 'Xóa "{name}"? Tất cả giao dịch sẽ bị xóa vĩnh viễn.'
  },
  'accounts.deletePasswordPrompt': {
    en: 'Enter password to confirm',
    vi: 'Nhập mật khẩu để xác nhận'
  },
  'accounts.empty': {
    en: 'No accounts yet. Create your first account to get started.',
    vi: 'Chưa có tài khoản. Tạo tài khoản đầu tiên để bắt đầu.'
  },
  'accounts.createdAt': {
    en: 'Created',
    vi: 'Ngày tạo'
  },
  'accounts.switch': {
    en: 'Switch Account',
    vi: 'Đổi tài khoản'
  },
  'accounts.errors.nameRequired': {
    en: 'Please enter an account name',
    vi: 'Vui lòng nhập tên tài khoản'
  },
  'accounts.errors.nameTooLong': {
    en: 'Account name must be 50 characters or less',
    vi: 'Tên tài khoản phải từ 50 ký tự trở xuống'
  },
  'accounts.errors.createFailed': {
    en: 'Failed to create account',
    vi: 'Tạo tài khoản thất bại'
  },
  'accounts.errors.deleteFailed': {
    en: 'Failed to delete account',
    vi: 'Xóa tài khoản thất bại'
  },
  'accounts.errors.wrongPassword': {
    en: 'Incorrect password',
    vi: 'Sai mật khẩu'
  },
  'accounts.cancel': {
    en: 'Cancel',
    vi: 'Hủy'
  },

  // ── Lock Screen additions ──
  'lock.errors.tokenMissing': {
    en: 'Data corrupted. Account reset required.',
    vi: 'Dữ liệu bị lỗi. Cần đặt lại tài khoản.'
  },
  'lock.resetAccount': {
    en: 'Reset Account',
    vi: 'Đặt lại tài khoản'
  },
  'lock.resetConfirm': {
    en: 'This will permanently delete all data for this account. Continue?',
    vi: 'Thao tác này sẽ xóa vĩnh viễn tất cả dữ liệu của tài khoản này. Tiếp tục?'
  },

  // ── Dashboard additions ──
  'dashboard.switchAccount': {
    en: 'Switch Account',
    vi: 'Đổi tài khoản'
  },

  // ── Session ──
  'session.timeoutWarning': {
    en: 'Session expired due to inactivity',
    vi: 'Phiên đã hết hạn do không hoạt động'
  }
};

export const categoryValueToKey = {
  'Food & Dining': 'cat.foodDining',
  'Transportation': 'cat.transportation',
  'Shopping': 'cat.shopping',
  'Entertainment': 'cat.entertainment',
  'Bills & Utilities': 'cat.billsUtilities',
  'Healthcare': 'cat.healthcare',
  'Travel': 'cat.travel',
  'Education': 'cat.education',
  'Gifts & Donations': 'cat.giftsDonations',
  'Salary': 'cat.salary',
  'Investment': 'cat.investment',
  'Other Income': 'cat.otherIncome'
};
