import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { ElMessage, ElMessageBox } from 'element-plus';
import Profile from '../../frontend/src/views/profile/index.vue';

// Mock Element Plus components
vi.mock('element-plus', () => ({
  ElMessage: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn()
  },
  ElMessageBox: {
    confirm: vi.fn()
  }
}));

// Mock API calls
vi.mock('../../frontend/src/api/user', () => ({
  getUserProfile: vi.fn(),
  updateUserProfile: vi.fn(),
  changePassword: vi.fn(),
  uploadAvatar: vi.fn(),
  getUserActivities: vi.fn(),
  getUserNotifications: vi.fn(),
  updateNotificationSettings: vi.fn(),
  bindThirdPartyAccount: vi.fn(),
  unbindThirdPartyAccount: vi.fn(),
  enableTwoFactor: vi.fn(),
  disableTwoFactor: vi.fn(),
  getLoginHistory: vi.fn(),
  exportUserData: vi.fn()
}));

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  }),
  useRoute: () => ({
    params: { id: '1' },
    query: {}
  })
}));

describe('Profile.vue', () => {
  let wrapper;
  
  const mockUserProfile = {
    id: 1,
    username: 'testuser',
    realName: '张三',
    email: 'test@example.com',
    phone: '13800138000',
    avatar: '/images/avatar.jpg',
    gender: 'MALE',
    birthday: '1990-01-01',
    idCard: '110101199001011234',
    address: '北京市朝阳区',
    joinDate: '2020-01-01',
    position: '党员',
    organization: {
      id: 1,
      name: '第一党支部'
    },
    roles: [
      { id: 1, name: '普通用户', code: 'USER' }
    ],
    lastLoginTime: '2024-01-15 10:30:00',
    loginCount: 156,
    status: 'ACTIVE',
    createTime: '2020-01-01 00:00:00',
    updateTime: '2024-01-15 10:30:00'
  };
  
  const mockUserActivities = [
    {
      id: 1,
      activityName: '党员学习会',
      activityType: 'STUDY',
      participationDate: '2024-01-10',
      status: 'COMPLETED',
      score: 95,
      feedback: '积极参与，表现优秀'
    },
    {
      id: 2,
      activityName: '志愿服务活动',
      activityType: 'VOLUNTEER',
      participationDate: '2024-01-05',
      status: 'COMPLETED',
      score: 88,
      feedback: '服务态度良好'
    }
  ];
  
  const mockNotifications = [
    {
      id: 1,
      title: '系统通知',
      content: '系统将于今晚进行维护',
      type: 'SYSTEM',
      isRead: false,
      createTime: '2024-01-15 09:00:00'
    },
    {
      id: 2,
      title: '活动提醒',
      content: '明天有党员学习会',
      type: 'ACTIVITY',
      isRead: true,
      createTime: '2024-01-14 18:00:00'
    }
  ];
  
  const mockLoginHistory = [
    {
      id: 1,
      loginTime: '2024-01-15 10:30:00',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: '北京市',
      status: 'SUCCESS'
    },
    {
      id: 2,
      loginTime: '2024-01-14 09:15:00',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      location: '北京市',
      status: 'SUCCESS'
    }
  ];

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup default mock implementations
    const {
      getUserProfile,
      updateUserProfile,
      changePassword,
      uploadAvatar,
      getUserActivities,
      getUserNotifications,
      getLoginHistory
    } = require('../../frontend/src/api/user');
    
    getUserProfile.mockResolvedValue({ data: mockUserProfile });
    updateUserProfile.mockResolvedValue({ success: true });
    changePassword.mockResolvedValue({ success: true });
    uploadAvatar.mockResolvedValue({ success: true, data: { url: '/images/new-avatar.jpg' } });
    getUserActivities.mockResolvedValue({ data: mockUserActivities });
    getUserNotifications.mockResolvedValue({ data: mockNotifications });
    getLoginHistory.mockResolvedValue({ data: mockLoginHistory });
    
    wrapper = mount(Profile, {
      global: {
        stubs: {
          'el-tabs': true,
          'el-tab-pane': true,
          'el-card': true,
          'el-form': true,
          'el-form-item': true,
          'el-input': true,
          'el-select': true,
          'el-option': true,
          'el-date-picker': true,
          'el-radio-group': true,
          'el-radio': true,
          'el-button': true,
          'el-upload': true,
          'el-avatar': true,
          'el-table': true,
          'el-table-column': true,
          'el-tag': true,
          'el-dialog': true,
          'el-descriptions': true,
          'el-descriptions-item': true,
          'el-alert': true,
          'el-divider': true,
          'el-tooltip': true,
          'el-switch': true,
          'el-badge': true,
          'el-timeline': true,
          'el-timeline-item': true,
          'el-statistic': true,
          'el-progress': true
        }
      }
    });
  });

  describe('组件初始化', () => {
    it('应该正确渲染组件', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('应该在挂载时加载用户数据', async () => {
      const { getUserProfile } = require('../../frontend/src/api/user');
      
      await wrapper.vm.$nextTick();
      
      expect(getUserProfile).toHaveBeenCalled();
    });

    it('应该正确设置初始数据', () => {
      expect(wrapper.vm.userProfile).toEqual({});
      expect(wrapper.vm.loading).toBe(false);
      expect(wrapper.vm.activeTab).toBe('basic');
      expect(wrapper.vm.showPasswordDialog).toBe(false);
      expect(wrapper.vm.showAvatarDialog).toBe(false);
    });
  });

  describe('用户资料管理', () => {
    it('应该能够加载用户资料', async () => {
      await wrapper.vm.loadUserProfile();
      await wrapper.vm.$nextTick();
      
      expect(wrapper.vm.userProfile).toEqual(mockUserProfile);
    });

    it('应该能够编辑用户资料', async () => {
      wrapper.vm.userProfile = mockUserProfile;
      
      await wrapper.vm.editProfile();
      
      expect(wrapper.vm.isEditMode).toBe(true);
      expect(wrapper.vm.editForm).toEqual(expect.objectContaining({
        realName: mockUserProfile.realName,
        email: mockUserProfile.email,
        phone: mockUserProfile.phone
      }));
    });

    it('应该能够保存用户资料', async () => {
      const { updateUserProfile } = require('../../frontend/src/api/user');
      
      wrapper.vm.editForm = {
        realName: '李四',
        email: 'lisi@example.com',
        phone: '13900139000',
        gender: 'FEMALE',
        birthday: '1992-05-15',
        address: '上海市浦东新区'
      };
      wrapper.vm.isEditMode = true;
      
      await wrapper.vm.saveProfile();
      
      expect(updateUserProfile).toHaveBeenCalledWith(expect.objectContaining({
        realName: '李四',
        email: 'lisi@example.com'
      }));
      expect(ElMessage.success).toHaveBeenCalledWith('资料更新成功');
      expect(wrapper.vm.isEditMode).toBe(false);
    });

    it('应该能够取消编辑', async () => {
      wrapper.vm.isEditMode = true;
      wrapper.vm.editForm = { realName: '修改的名字' };
      
      await wrapper.vm.cancelEdit();
      
      expect(wrapper.vm.isEditMode).toBe(false);
      expect(wrapper.vm.editForm).toEqual({});
    });

    it('应该能够验证用户资料表单', () => {
      const validForm = {
        realName: '张三',
        email: 'test@example.com',
        phone: '13800138000'
      };
      
      const invalidForm = {
        realName: '',
        email: 'invalid-email',
        phone: '123'
      };
      
      expect(wrapper.vm.validateProfileForm(validForm)).toBe(true);
      expect(wrapper.vm.validateProfileForm(invalidForm)).toBe(false);
    });
  });

  describe('头像管理', () => {
    it('应该能够打开头像上传对话框', async () => {
      await wrapper.vm.openAvatarDialog();
      
      expect(wrapper.vm.showAvatarDialog).toBe(true);
    });

    it('应该能够上传头像', async () => {
      const { uploadAvatar } = require('../../frontend/src/api/user');
      
      const file = new File(['avatar'], 'avatar.jpg', { type: 'image/jpeg' });
      
      await wrapper.vm.uploadAvatar(file);
      
      expect(uploadAvatar).toHaveBeenCalledWith(file);
      expect(ElMessage.success).toHaveBeenCalledWith('头像上传成功');
    });

    it('应该能够验证头像文件', () => {
      const validFile = new File(['image'], 'avatar.jpg', { type: 'image/jpeg' });
      const invalidFile = new File(['text'], 'file.txt', { type: 'text/plain' });
      const largeFile = new File([new ArrayBuffer(3 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
      
      expect(wrapper.vm.validateAvatarFile(validFile)).toBe(true);
      expect(wrapper.vm.validateAvatarFile(invalidFile)).toBe(false);
      expect(wrapper.vm.validateAvatarFile(largeFile)).toBe(false);
    });

    it('应该能够预览头像', async () => {
      const file = new File(['image'], 'avatar.jpg', { type: 'image/jpeg' });
      
      await wrapper.vm.previewAvatar(file);
      
      expect(wrapper.vm.avatarPreview).toBeTruthy();
    });

    it('应该能够取消头像上传', async () => {
      wrapper.vm.showAvatarDialog = true;
      wrapper.vm.avatarPreview = 'data:image/jpeg;base64,test';
      
      await wrapper.vm.cancelAvatarUpload();
      
      expect(wrapper.vm.showAvatarDialog).toBe(false);
      expect(wrapper.vm.avatarPreview).toBe('');
    });
  });

  describe('密码管理', () => {
    it('应该能够打开修改密码对话框', async () => {
      await wrapper.vm.openPasswordDialog();
      
      expect(wrapper.vm.showPasswordDialog).toBe(true);
      expect(wrapper.vm.passwordForm).toEqual({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    });

    it('应该能够修改密码', async () => {
      const { changePassword } = require('../../frontend/src/api/user');
      
      wrapper.vm.passwordForm = {
        oldPassword: 'oldpass123',
        newPassword: 'newpass123',
        confirmPassword: 'newpass123'
      };
      
      await wrapper.vm.changePassword();
      
      expect(changePassword).toHaveBeenCalledWith({
        oldPassword: 'oldpass123',
        newPassword: 'newpass123'
      });
      expect(ElMessage.success).toHaveBeenCalledWith('密码修改成功');
      expect(wrapper.vm.showPasswordDialog).toBe(false);
    });

    it('应该能够验证密码表单', () => {
      const validForm = {
        oldPassword: 'oldpass123',
        newPassword: 'newpass123',
        confirmPassword: 'newpass123'
      };
      
      const invalidForm = {
        oldPassword: '',
        newPassword: '123',
        confirmPassword: '456'
      };
      
      expect(wrapper.vm.validatePasswordForm(validForm)).toBe(true);
      expect(wrapper.vm.validatePasswordForm(invalidForm)).toBe(false);
    });

    it('应该能够检查密码强度', () => {
      expect(wrapper.vm.checkPasswordStrength('123')).toBe('weak');
      expect(wrapper.vm.checkPasswordStrength('password123')).toBe('medium');
      expect(wrapper.vm.checkPasswordStrength('Password123!')).toBe('strong');
    });

    it('应该能够取消密码修改', async () => {
      wrapper.vm.showPasswordDialog = true;
      wrapper.vm.passwordForm = {
        oldPassword: 'test',
        newPassword: 'test',
        confirmPassword: 'test'
      };
      
      await wrapper.vm.cancelPasswordChange();
      
      expect(wrapper.vm.showPasswordDialog).toBe(false);
      expect(wrapper.vm.passwordForm).toEqual({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    });
  });

  describe('活动记录', () => {
    it('应该能够加载用户活动记录', async () => {
      await wrapper.vm.loadUserActivities();
      await wrapper.vm.$nextTick();
      
      expect(wrapper.vm.userActivities).toEqual(mockUserActivities);
    });

    it('应该能够筛选活动记录', async () => {
      wrapper.vm.userActivities = mockUserActivities;
      
      await wrapper.vm.filterActivities('STUDY');
      
      const filtered = wrapper.vm.filteredActivities;
      expect(filtered.every(activity => activity.activityType === 'STUDY')).toBe(true);
    });

    it('应该能够按日期范围筛选活动', async () => {
      wrapper.vm.userActivities = mockUserActivities;
      
      await wrapper.vm.filterActivitiesByDateRange('2024-01-01', '2024-01-10');
      
      const filtered = wrapper.vm.filteredActivities;
      expect(filtered.length).toBeGreaterThan(0);
    });

    it('应该能够计算活动统计', () => {
      wrapper.vm.userActivities = mockUserActivities;
      
      const stats = wrapper.vm.calculateActivityStats();
      
      expect(stats.totalActivities).toBe(2);
      expect(stats.completedActivities).toBe(2);
      expect(stats.averageScore).toBe(91.5);
    });

    it('应该能够导出活动记录', async () => {
      wrapper.vm.userActivities = mockUserActivities;
      
      await wrapper.vm.exportActivities();
      
      expect(ElMessage.success).toHaveBeenCalledWith('活动记录导出成功');
    });
  });

  describe('通知管理', () => {
    it('应该能够加载用户通知', async () => {
      await wrapper.vm.loadUserNotifications();
      await wrapper.vm.$nextTick();
      
      expect(wrapper.vm.notifications).toEqual(mockNotifications);
    });

    it('应该能够标记通知为已读', async () => {
      wrapper.vm.notifications = mockNotifications;
      
      await wrapper.vm.markNotificationAsRead(mockNotifications[0]);
      
      expect(mockNotifications[0].isRead).toBe(true);
    });

    it('应该能够批量标记通知为已读', async () => {
      wrapper.vm.notifications = mockNotifications;
      
      await wrapper.vm.markAllNotificationsAsRead();
      
      expect(wrapper.vm.notifications.every(n => n.isRead)).toBe(true);
    });

    it('应该能够删除通知', async () => {
      wrapper.vm.notifications = mockNotifications;
      
      ElMessageBox.confirm.mockResolvedValue('confirm');
      
      await wrapper.vm.deleteNotification(mockNotifications[0]);
      
      expect(wrapper.vm.notifications.length).toBe(1);
    });

    it('应该能够筛选通知', async () => {
      wrapper.vm.notifications = mockNotifications;
      
      await wrapper.vm.filterNotifications('SYSTEM');
      
      const filtered = wrapper.vm.filteredNotifications;
      expect(filtered.every(n => n.type === 'SYSTEM')).toBe(true);
    });

    it('应该能够计算未读通知数量', () => {
      wrapper.vm.notifications = mockNotifications;
      
      const unreadCount = wrapper.vm.getUnreadNotificationCount();
      
      expect(unreadCount).toBe(1);
    });
  });

  describe('通知设置', () => {
    it('应该能够更新通知设置', async () => {
      const { updateNotificationSettings } = require('../../frontend/src/api/user');
      updateNotificationSettings.mockResolvedValue({ success: true });
      
      const settings = {
        emailNotification: true,
        smsNotification: false,
        systemNotification: true,
        activityNotification: true
      };
      
      await wrapper.vm.updateNotificationSettings(settings);
      
      expect(updateNotificationSettings).toHaveBeenCalledWith(settings);
      expect(ElMessage.success).toHaveBeenCalledWith('通知设置更新成功');
    });

    it('应该能够重置通知设置', async () => {
      wrapper.vm.notificationSettings = {
        emailNotification: false,
        smsNotification: false,
        systemNotification: false,
        activityNotification: false
      };
      
      await wrapper.vm.resetNotificationSettings();
      
      expect(wrapper.vm.notificationSettings).toEqual({
        emailNotification: true,
        smsNotification: true,
        systemNotification: true,
        activityNotification: true
      });
    });
  });

  describe('安全设置', () => {
    it('应该能够启用双因子认证', async () => {
      const { enableTwoFactor } = require('../../frontend/src/api/user');
      enableTwoFactor.mockResolvedValue({ success: true, qrCode: 'qr-code-data' });
      
      await wrapper.vm.enableTwoFactor();
      
      expect(enableTwoFactor).toHaveBeenCalled();
      expect(wrapper.vm.twoFactorQrCode).toBe('qr-code-data');
      expect(wrapper.vm.showTwoFactorDialog).toBe(true);
    });

    it('应该能够禁用双因子认证', async () => {
      const { disableTwoFactor } = require('../../frontend/src/api/user');
      disableTwoFactor.mockResolvedValue({ success: true });
      
      ElMessageBox.confirm.mockResolvedValue('confirm');
      
      await wrapper.vm.disableTwoFactor();
      
      expect(ElMessageBox.confirm).toHaveBeenCalled();
      expect(disableTwoFactor).toHaveBeenCalled();
      expect(ElMessage.success).toHaveBeenCalledWith('双因子认证已禁用');
    });

    it('应该能够绑定第三方账号', async () => {
      const { bindThirdPartyAccount } = require('../../frontend/src/api/user');
      bindThirdPartyAccount.mockResolvedValue({ success: true });
      
      await wrapper.vm.bindThirdPartyAccount('wechat', 'wechat-code');
      
      expect(bindThirdPartyAccount).toHaveBeenCalledWith('wechat', 'wechat-code');
      expect(ElMessage.success).toHaveBeenCalledWith('微信账号绑定成功');
    });

    it('应该能够解绑第三方账号', async () => {
      const { unbindThirdPartyAccount } = require('../../frontend/src/api/user');
      unbindThirdPartyAccount.mockResolvedValue({ success: true });
      
      ElMessageBox.confirm.mockResolvedValue('confirm');
      
      await wrapper.vm.unbindThirdPartyAccount('wechat');
      
      expect(ElMessageBox.confirm).toHaveBeenCalled();
      expect(unbindThirdPartyAccount).toHaveBeenCalledWith('wechat');
      expect(ElMessage.success).toHaveBeenCalledWith('微信账号解绑成功');
    });
  });

  describe('登录历史', () => {
    it('应该能够加载登录历史', async () => {
      await wrapper.vm.loadLoginHistory();
      await wrapper.vm.$nextTick();
      
      expect(wrapper.vm.loginHistory).toEqual(mockLoginHistory);
    });

    it('应该能够筛选登录历史', async () => {
      wrapper.vm.loginHistory = mockLoginHistory;
      
      await wrapper.vm.filterLoginHistory('SUCCESS');
      
      const filtered = wrapper.vm.filteredLoginHistory;
      expect(filtered.every(record => record.status === 'SUCCESS')).toBe(true);
    });

    it('应该能够按日期范围筛选登录历史', async () => {
      wrapper.vm.loginHistory = mockLoginHistory;
      
      await wrapper.vm.filterLoginHistoryByDateRange('2024-01-14', '2024-01-15');
      
      const filtered = wrapper.vm.filteredLoginHistory;
      expect(filtered.length).toBeGreaterThan(0);
    });

    it('应该能够导出登录历史', async () => {
      wrapper.vm.loginHistory = mockLoginHistory;
      
      await wrapper.vm.exportLoginHistory();
      
      expect(ElMessage.success).toHaveBeenCalledWith('登录历史导出成功');
    });

    it('应该能够格式化用户代理信息', () => {
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
      
      const formatted = wrapper.vm.formatUserAgent(userAgent);
      
      expect(formatted).toContain('Windows');
    });

    it('应该能够检测异常登录', () => {
      const normalRecord = {
        ipAddress: '192.168.1.100',
        location: '北京市',
        loginTime: '2024-01-15 10:30:00'
      };
      
      const suspiciousRecord = {
        ipAddress: '1.2.3.4',
        location: '美国',
        loginTime: '2024-01-15 03:00:00'
      };
      
      expect(wrapper.vm.isSuspiciousLogin(normalRecord)).toBe(false);
      expect(wrapper.vm.isSuspiciousLogin(suspiciousRecord)).toBe(true);
    });
  });

  describe('数据导出', () => {
    it('应该能够导出个人数据', async () => {
      const { exportUserData } = require('../../frontend/src/api/user');
      exportUserData.mockResolvedValue({ success: true });
      
      await wrapper.vm.exportUserData();
      
      expect(exportUserData).toHaveBeenCalled();
      expect(ElMessage.success).toHaveBeenCalledWith('个人数据导出成功');
    });

    it('应该能够选择导出数据类型', async () => {
      const exportTypes = ['profile', 'activities', 'notifications', 'loginHistory'];
      
      await wrapper.vm.selectExportTypes(exportTypes);
      
      expect(wrapper.vm.selectedExportTypes).toEqual(exportTypes);
    });

    it('应该能够预览导出数据', async () => {
      wrapper.vm.selectedExportTypes = ['profile', 'activities'];
      
      const preview = wrapper.vm.previewExportData();
      
      expect(preview).toHaveProperty('profile');
      expect(preview).toHaveProperty('activities');
    });
  });

  describe('标签页管理', () => {
    it('应该能够切换标签页', async () => {
      await wrapper.vm.switchTab('security');
      
      expect(wrapper.vm.activeTab).toBe('security');
    });

    it('应该能够获取标签页标题', () => {
      expect(wrapper.vm.getTabTitle('basic')).toBe('基本信息');
      expect(wrapper.vm.getTabTitle('security')).toBe('安全设置');
      expect(wrapper.vm.getTabTitle('activities')).toBe('活动记录');
      expect(wrapper.vm.getTabTitle('notifications')).toBe('通知管理');
    });

    it('应该能够检查标签页权限', () => {
      expect(wrapper.vm.hasTabPermission('basic')).toBe(true);
      expect(wrapper.vm.hasTabPermission('security')).toBe(true);
    });
  });

  describe('错误处理', () => {
    it('应该处理加载用户资料失败的情况', async () => {
      const { getUserProfile } = require('../../frontend/src/api/user');
      getUserProfile.mockRejectedValue(new Error('网络错误'));
      
      await wrapper.vm.loadUserProfile();
      
      expect(ElMessage.error).toHaveBeenCalledWith('加载用户资料失败');
    });

    it('应该处理保存用户资料失败的情况', async () => {
      const { updateUserProfile } = require('../../frontend/src/api/user');
      updateUserProfile.mockRejectedValue(new Error('保存失败'));
      
      wrapper.vm.editForm = { realName: '测试' };
      
      await wrapper.vm.saveProfile();
      
      expect(ElMessage.error).toHaveBeenCalledWith('资料更新失败');
    });

    it('应该处理密码修改失败的情况', async () => {
      const { changePassword } = require('../../frontend/src/api/user');
      changePassword.mockRejectedValue(new Error('密码错误'));
      
      wrapper.vm.passwordForm = {
        oldPassword: 'wrong',
        newPassword: 'new123',
        confirmPassword: 'new123'
      };
      
      await wrapper.vm.changePassword();
      
      expect(ElMessage.error).toHaveBeenCalledWith('密码修改失败');
    });

    it('应该处理头像上传失败的情况', async () => {
      const { uploadAvatar } = require('../../frontend/src/api/user');
      uploadAvatar.mockRejectedValue(new Error('上传失败'));
      
      const file = new File(['avatar'], 'avatar.jpg', { type: 'image/jpeg' });
      
      await wrapper.vm.uploadAvatar(file);
      
      expect(ElMessage.error).toHaveBeenCalledWith('头像上传失败');
    });
  });

  describe('权限控制', () => {
    it('应该能够检查编辑权限', () => {
      const hasEditPermission = wrapper.vm.hasEditPermission();
      
      expect(typeof hasEditPermission).toBe('boolean');
    });

    it('应该能够检查密码修改权限', () => {
      const hasPasswordPermission = wrapper.vm.hasPasswordPermission();
      
      expect(typeof hasPasswordPermission).toBe('boolean');
    });

    it('应该能够检查数据导出权限', () => {
      const hasExportPermission = wrapper.vm.hasExportPermission();
      
      expect(typeof hasExportPermission).toBe('boolean');
    });
  });

  describe('响应式设计', () => {
    it('应该能够适配移动端显示', async () => {
      wrapper.vm.isMobile = true;
      
      await wrapper.vm.$nextTick();
      
      expect(wrapper.vm.layoutMode).toBe('mobile');
    });

    it('应该能够调整表单布局', async () => {
      wrapper.vm.windowWidth = 800;
      
      const formLayout = wrapper.vm.getFormLayout();
      
      expect(formLayout).toHaveProperty('labelWidth');
      expect(formLayout).toHaveProperty('size');
    });
  });

  describe('性能优化', () => {
    it('应该能够防抖表单验证', async () => {
      const validateSpy = vi.spyOn(wrapper.vm, 'validateProfileForm');
      
      // 快速连续输入
      wrapper.vm.debouncedValidate({ realName: 'test' });
      wrapper.vm.debouncedValidate({ realName: 'test1' });
      wrapper.vm.debouncedValidate({ realName: 'test12' });
      
      // 等待防抖延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    it('应该能够缓存用户数据', async () => {
      wrapper.vm.userProfile = mockUserProfile;
      
      wrapper.vm.cacheUserData();
      
      const cachedData = wrapper.vm.getCachedUserData();
      expect(cachedData).toEqual(mockUserProfile);
    });

    it('应该能够清除用户数据缓存', async () => {
      wrapper.vm.cacheUserData();
      
      wrapper.vm.clearUserDataCache();
      
      const cachedData = wrapper.vm.getCachedUserData();
      expect(cachedData).toBeNull();
    });
  });
});