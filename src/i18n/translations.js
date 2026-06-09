export const translations = {
  'app.copyright': {
    en: 'Katsukii Neko. All rights reserved.',
    vi: 'Katsukii Neko. All rights reserved.'
  },

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
    vi: 'Mật khẩu phải có ít nhất 4 ký tự'
  },
  'lock.errors.locked': {
    en: 'Account is temporarily locked. Please try again later.',
    vi: 'Tài khoản đã bị khóa tạm thời. Vui lòng thử lại sau.'
  },
  'lock.errors.corrupted': {
    en: 'Corrupted data. Please reset the app.',
    vi: 'Dữ liệu bị lỗi. Vui lòng đặt lại ứng dụng.'
  },
  'lock.errors.invalid': {
    en: 'Invalid password',
    vi: 'Mật khẩu không đúng'
  },
  'lock.errors.tooManyAttempts': {
    en: 'Too many failed attempts. Account temporarily locked.',
    vi: 'Thử sai quá nhiều lần. Tài khoản đã bị khóa tạm thời.'
  },
  'lock.errors.unlockFailed': {
    en: 'Failed to unlock. Please try again.',
    vi: 'Mở khóa thất bại. Vui lòng thử lại.'
  },
  'lock.lockoutTimer': {
    en: 'Account locked. Try again in: {seconds}s',
    vi: 'Tài khoản bị khóa. Thử lại sau: {seconds}s'
  },
  'lock.info.encrypted': {
    en: 'Your financial data is encrypted and stored locally on your device.',
    vi: 'Dữ liệu của bạn được mã hóa và lưu cục bộ trên thiết bị.'
  },
  'lock.info.noServer': {
    en: 'No data is sent to any server.',
    vi: 'Không gửi dữ liệu về máy chủ.'
  },

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
    vi: 'Tổng số dư'
  },
  'dashboard.income': {
    en: 'Income',
    vi: 'Thu nhập'
  },
  'dashboard.expenses': {
    en: 'Expenses',
    vi: 'Chi tiêu'
  },
  'dashboard.sessionExpired': {
    en: 'Session expired',
    vi: 'Phiên làm việc đã hết hạn'
  },
  'dashboard.noFileSelected': {
    en: 'No file selected',
    vi: 'Chưa chọn tệp'
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
    vi: 'Ghi chú (không bắt buộc)'
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
    vi: 'Phiên hết hạn. Vui lòng mở khóa lại.'
  },
  'form.success.added': {
    en: 'Transaction added successfully!',
    vi: 'Thêm giao dịch thành công!'
  },
  'form.errors.addFailed': {
    en: 'Failed to add transaction. Please try again.',
    vi: 'Thêm giao dịch thất bại. Vui lòng thử lại.'
  },

  'cat.foodDining': {
    en: 'Food & Dining',
    vi: 'Ăn uống'
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
    vi: 'Sức khỏe & Y tế'
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
    vi: 'Chưa có giao dịch nào.'
  },
  'history.errors.sessionExpired': {
    en: 'Session expired. Please unlock again.',
    vi: 'Phiên hết hạn. Vui lòng mở khóa lại.'
  },
  'history.errors.loadFailed': {
    en: 'Failed to load transactions',
    vi: 'Tải giao dịch thất bại'
  },
  'history.errors.deleteFailed': {
    en: 'Failed to delete transaction',
    vi: 'Xóa giao dịch thất bại'
  },
  'history.delete': {
    en: 'Delete transaction',
    vi: 'Xóa giao dịch'
  },
  'history.deleteConfirm': {
    en: 'Confirm delete',
    vi: 'Xác nhận xóa'
  },

  'forecast.title': {
    en: 'Monthly Forecast',
    vi: 'Dự báo chi tiêu tháng'
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
    vi: 'Trung bình chi tiêu/ngày:'
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
  'forecast.overspending': {
    en: 'Overspending',
    vi: 'Vượt ngân sách'
  },
  'forecast.onTrack': {
    en: 'On Track',
    vi: 'Đúng kế hoạch'
  },
  'forecast.spendingPace': {
    en: 'Spending Pace:',
    vi: 'Tốc độ chi tiêu:'
  },
  'forecast.typicalSpending': {
    en: 'Typical Monthly:',
    vi: 'Trung bình tháng:'
  },
  'forecast.projectedSpending': {
    en: 'Projected This Month:',
    vi: 'Dự kiến chi tiêu tháng này:'
  },
  'forecast.noBaseline': {
    en: 'N/A — not enough history',
    vi: 'N/A — chưa đủ lịch sử'
  },
  'forecast.noBaselineData': {
    en: 'No baseline data',
    vi: 'Không có dữ liệu tham chiếu'
  },
  'forecast.needsMoreData': {
    en: 'Based on limited data',
    vi: 'Dựa trên dữ liệu hạn chế'
  },

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
    vi: 'Nhập lại mật khẩu mới'
  },
  'password.update': {
    en: 'Update Password',
    vi: 'Cập nhật mật khẩu'
  },
  'password.reEncrypting': {
    en: 'Re-encrypting...',
    vi: 'Đang mã hóa lại dữ liệu...'
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
    vi: 'Mật khẩu mới phải có ít nhất 4 ký tự'
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
    vi: 'Không thể giải mã dữ liệu. Đã hủy đổi mật khẩu.'
  },
  'password.success.changed': {
    en: 'Password changed successfully. All data re-encrypted.',
    vi: 'Đổi mật khẩu thành công. Dữ liệu đã được mã hóa lại.'
  },
  'password.errors.changeFailed': {
    en: 'Failed to change password: ',
    vi: 'Đổi mật khẩu thất bại: '
  },
  'password.errors.cooldown': {
    en: 'Too many attempts. Wait {seconds}s before trying again.',
    vi: 'Thử sai quá nhiều lần. Vui lòng đợi {seconds}s rồi thử lại.'
  },
  'password.errors.tooManyAttempts': {
    en: 'Maximum attempts reached. Close and reopen the app to try again.',
    vi: 'Đã đạt số lần thử tối đa. Vui lòng khởi động lại app để thử lại.'
  },

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
    vi: 'Sao lưu thành công!'
  },
  'backup.failedPrefix': {
    en: 'Backup failed: ',
    vi: 'Sao lưu thất bại: '
  },
  'backup.confirmRestore': {
    en: 'Restoring will replace all current data. Continue?',
    vi: 'Khôi phục sẽ ghi đè và thay thế toàn bộ dữ liệu hiện tại. Tiếp tục?'
  },
  'backup.restoreStarted': {
    en: 'Restore started...',
    vi: 'Bắt đầu khôi phục...'
  },
  'backup.restoreSuccess': {
    en: 'Restore completed! {count} transactions restored.',
    vi: 'Khôi phục thành công! Đã khôi phục {count} giao dịch.'
  },
  'backup.failedRestorePrefix': {
    en: 'Restore failed: ',
    vi: 'Khôi phục thất bại: '
  },
  'backup.secureBackupBtn': {
    en: 'Secure Backup',
    vi: 'Sao lưu bảo mật'
  },
  'backup.secureBackupTitle': {
    en: 'Create Secure Backup',
    vi: 'Tạo bản sao lưu bảo mật'
  },
  'backup.secureRestoreTitle': {
    en: 'Restore Secure Backup',
    vi: 'Khôi phục bản sao lưu bảo mật'
  },
  'backup.enterPassword': {
    en: 'Backup Password',
    vi: 'Mật khẩu sao lưu'
  },
  'backup.confirmPassword': {
    en: 'Confirm Password',
    vi: 'Xác nhận mật khẩu'
  },
  'backup.passwordPlaceholder': {
    en: 'Enter backup password',
    vi: 'Nhập mật khẩu sao lưu'
  },
  'backup.confirmPlaceholder': {
    en: 'Re-enter password',
    vi: 'Nhập lại mật khẩu'
  },
  'backup.passwordTooShort': {
    en: 'Password must be at least 8 characters',
    vi: 'Mật khẩu phải có ít nhất 8 ký tự'
  },
  'backup.passwordMismatch': {
    en: 'Passwords do not match',
    vi: 'Mật khẩu không khớp'
  },
  'backup.createBtn': {
    en: 'Create Backup',
    vi: 'Tạo bản sao lưu'
  },
  'backup.processing': {
    en: 'Processing...',
    vi: 'Đang xử lý...'
  },
  'backup.restoring': {
    en: 'Restoring...',
    vi: 'Đang khôi phục...'
  },
  'backup.cooldown': {
    en: 'Too many attempts. Wait {seconds}s.',
    vi: 'Thử sai quá nhiều lần. Đợi {seconds}s.'
  },
  'backup.lockout.session_limit': {
    en: 'Maximum attempts reached. Close and reopen the app to try again.',
    vi: 'Đã đạt số lần thử tối đa. Vui lòng khởi động lại app.'
  },
  'backup.lockout.time_lockout': {
    en: 'Too many failed attempts. Wait {seconds}s.',
    vi: 'Thử sai quá nhiều lần. Đợi {seconds}s.'
  },
  'backup.powProgress': {
    en: 'Computing verification... ({seconds}s elapsed)',
    vi: 'Đang xác minh... (Đã qua {seconds}s)'
  },
  'backup.powFailed': {
    en: 'Verification computation failed. Please try again.',
    vi: 'Xác minh thất bại. Vui lòng thử lại.'
  },
  'backup.escalatedDeriving': {
    en: 'Deriving key (enhanced security)...',
    vi: 'Đang tạo khóa bảo mật...'
  },
  'backup.accountName': {
    en: 'Account',
    vi: 'Tài khoản'
  },
  'backup.backupDate': {
    en: 'Backup Date',
    vi: 'Ngày sao lưu'
  },

  'accounts.title': {
    en: 'Money Vault',
    vi: 'Money Vault'
  },
  'accounts.selectPrompt': {
    en: 'Select an account',
    vi: 'Chọn một tài khoản'
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
    vi: 'Tên tài khoản tối đa 50 ký tự'
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
    vi: 'Mật khẩu không đúng'
  },
  'accounts.cancel': {
    en: 'Cancel',
    vi: 'Hủy'
  },
  'accounts.lastUsed': {
    en: 'Last used',
    vi: 'Dùng gần đây'
  },

  'lock.errors.tokenMissing': {
    en: 'Data corrupted. Account reset required.',
    vi: 'Dữ liệu lỗi. Cần đặt lại tài khoản.'
  },
  'lock.resetAccount': {
    en: 'Reset Account',
    vi: 'Đặt lại tài khoản'
  },
  'lock.resetConfirm': {
    en: 'This will permanently delete all data for this account. Continue?',
    vi: 'Thao tác này sẽ xóa vĩnh viễn mọi dữ liệu của tài khoản này. Tiếp tục?'
  },
  'lock.resetConfirmType': {
    en: 'Type "{name}" to confirm permanent deletion:',
    vi: 'Nhập "{name}" để xác nhận xóa vĩnh viễn:'
  },
  'lock.resetNameMismatch': {
    en: 'Account name does not match. Type the exact name shown.',
    vi: 'Tên tài khoản không khớp. Vui lòng nhập chính xác.'
  },

  'dashboard.switchAccount': {
    en: 'Switch Account',
    vi: 'Đổi tài khoản'
  },

  'session.timeoutWarning': {
    en: 'Session expired due to inactivity',
    vi: 'Phiên làm việc hết hạn do không hoạt động'
  },

  'onboarding.welcome': {
    en: 'Welcome to Money Vault',
    vi: 'Chào mừng đến với Money Vault'
  },
  'onboarding.getStarted': {
    en: 'Let\'s get you set up',
    vi: 'Bắt đầu thiết lập thôi'
  },
  'onboarding.step1Title': {
    en: 'Add Your First Transaction',
    vi: 'Thêm giao dịch đầu tiên'
  },
  'onboarding.step1Desc': {
    en: 'Track your income and expenses by adding transactions. Choose a category, enter the amount, and you\'re done.',
    vi: 'Theo dõi thu nhập và chi tiêu bằng cách ghi lại giao dịch. Chọn danh mục, nhập số tiền là xong.'
  },
  'onboarding.step2Title': {
    en: 'Track Your Forecast',
    vi: 'Theo dõi dự báo dòng tiền'
  },
  'onboarding.step2Desc': {
    en: 'See where your money is going. The forecast shows your spending pace and projected balance for the month.',
    vi: 'Nắm rõ tiền của bạn đi đâu. Mục dự báo sẽ hiển thị tốc độ chi tiêu và số dư ước tính cuối tháng.'
  },
  'onboarding.step3Title': {
    en: 'Your Data is Secure',
    vi: 'Dữ liệu được bảo mật tuyệt đối'
  },
  'onboarding.step3Desc': {
    en: 'All your data is encrypted and stored only on your device. Create backups in the Settings menu to keep your data safe.',
    vi: 'Mọi dữ liệu đều được mã hóa và chỉ lưu trên thiết bị. Bạn có thể tạo bản sao lưu trong phần Cài đặt để tránh mất dữ liệu.'
  },
  'onboarding.skip': {
    en: 'Skip',
    vi: 'Bỏ qua'
  },
  'onboarding.next': {
    en: 'Next',
    vi: 'Tiếp theo'
  },
  'onboarding.done': {
    en: 'Get Started',
    vi: 'Bắt đầu ngay'
  },

  'settings.title': {
    en: 'Settings',
    vi: 'Cài đặt'
  },
  'settings.security': {
    en: 'Security',
    vi: 'Bảo mật'
  },
  'settings.data': {
    en: 'Data',
    vi: 'Dữ liệu'
  },
  'settings.appearance': {
    en: 'Appearance',
    vi: 'Giao diện'
  },
  'settings.currency': {
    en: 'Currency',
    vi: 'Đơn vị tiền tệ'
  },

  'confirm.restore': {
    en: 'Restore Backup',
    vi: 'Khôi phục bản sao lưu'
  },
  'confirm.restoreMessage': {
    en: 'Restoring will replace all current data with the backup. This cannot be undone.',
    vi: 'Quá trình khôi phục sẽ ghi đè và thay thế toàn bộ dữ liệu hiện tại. Thao tác này không thể hoàn tác.'
  },
  'confirm.continue': {
    en: 'Continue',
    vi: 'Tiếp tục'
  },

  'empty.transactions.title': {
    en: 'No transactions yet',
    vi: 'Chưa có giao dịch'
  },
  'empty.transactions.desc': {
    en: 'Add your first transaction above to start tracking your finances.',
    vi: 'Hãy thêm giao dịch đầu tiên ở trên để bắt đầu theo dõi tài chính.'
  },
  'empty.forecast.title': {
    en: 'Not enough data',
    vi: 'Chưa đủ dữ liệu hiển thị'
  },
  'empty.forecast.desc': {
    en: 'Add some transactions to see your spending forecast.',
    vi: 'Thêm một vài giao dịch để xem dự báo chi tiêu.'
  },

  'hint.addTransaction': {
    en: 'Start here: add your first transaction',
    vi: 'Bắt đầu tại đây: thêm giao dịch đầu tiên'
  },
  'hint.settings': {
    en: 'Manage password and backups here',
    vi: 'Quản lý mật khẩu và sao lưu tại đây'
  },

  'form.amountHint': {
    en: '',
    vi: '(đơn vị: nghìn VNĐ)'
  },
  'form.amountPlaceholder': {
    en: '0.00',
    vi: '0'
  },

  'forecast.fixedBills': {
    en: 'Expected Bills',
    vi: 'Hóa đơn định kỳ dự kiến'
  },
  'forecast.fixedBillsPending': {
    en: 'Pending',
    vi: 'Chưa thanh toán'
  },

  'monthPicker.futureMessage': {
    en: 'Are you from the future?',
    vi: 'Bạn đến từ tương lai à?'
  },
  'monthPicker.noData': {
    en: 'No transactions recorded this month',
    vi: 'Tháng này không có giao dịch nào'
  },

  'forecast.clickToCorrect': {
    en: 'Click to correct prediction',
    vi: 'Nhấp để điều chỉnh dự đoán'
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