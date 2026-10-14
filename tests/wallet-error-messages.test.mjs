import assert from 'node:assert/strict'
import test from 'node:test'

import { getLocalizedWalletErrorMessage, getWalletErrorCode } from '../dist/web3-bs.esm.js'

test('wallet errors are localized into actionable Chinese copy', () => {
  assert.match(getLocalizedWalletErrorMessage({ code: 4001 }, { locale: 'zh-CN' }), /取消本次钱包操作/)
  assert.match(getLocalizedWalletErrorMessage({ code: -32002 }, { locale: 'zh-CN' }), /已有待处理的确认请求/)
  assert.match(getLocalizedWalletErrorMessage({ code: 'WALLET_LOCKED' }, { locale: 'zh-CN' }), /钱包当前已锁定/)
  assert.match(
    getLocalizedWalletErrorMessage({ code: -32601, message: 'the method wallet_profile does not exist/is not available' }, { locale: 'zh-CN' }),
    /不支持此操作/
  )
  assert.match(
    getLocalizedWalletErrorMessage({ payload: { data: { code: 'identity_credential_required:EmailCredential' } } }, { locale: 'zh-CN' }),
    /缺少此应用要求的已验证资料/
  )
  assert.match(getLocalizedWalletErrorMessage(new Error('IDENTITY_WALLET_NOT_VERIFIED'), { locale: 'zh-CN' }), /完成钱包账户验证/)
  assert.match(getLocalizedWalletErrorMessage(new Error('IDENTITY_SCOPE_MISMATCH'), { locale: 'zh-CN' }), /身份权限不一致/)
  assert.match(getLocalizedWalletErrorMessage(new Error('IDENTITY_CREDENTIAL_REQUIRED:EmailCredential'), { locale: 'zh-CN' }), /缺少此应用要求的已验证资料/)
})

test('wallet errors are localized into actionable English copy', () => {
  assert.match(getLocalizedWalletErrorMessage({ code: 4900 }, { locale: 'en-US' }), /connection was interrupted/)
  assert.match(getLocalizedWalletErrorMessage({ code: 'IDENTITY_WALLET_NOT_VERIFIED' }, { locale: 'en-US' }), /has not completed wallet account verification/)
})

test('DApps can override a localized message without changing error classification', () => {
  assert.equal(
    getLocalizedWalletErrorMessage({ code: 4001 }, { locale: 'zh-CN', messages: { userRejected: '已取消登录' } }),
    '已取消登录'
  )
})

test('numeric error codes ignore null and fall through to cause.code', () => {
  assert.equal(getWalletErrorCode({ code: null, cause: { code: 4001 } }), 4001)
  assert.equal(getWalletErrorCode({ code: 'not-a-number', cause: { code: '4900' } }), 4900)
  assert.equal(getWalletErrorCode({ code: null }), null)
})
