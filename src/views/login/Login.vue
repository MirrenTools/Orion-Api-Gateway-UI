<template>
	<div class="login-container">
		<div class="from-box">
			<h1 style="text-align: center;color: white;">{{ $t('Orion Console') }}</h1>
			<el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="auto" width="95%">
				<el-form-item prop="id">
					<el-input type="text" v-model="loginForm.id" maxlength="32" :placeholder="$t('Please enter account')" autocomplete="off">
						<template slot="prepend">
							<i class="el-icon-s-custom" style="font-size: 1.25rem;"></i>
						</template>
					</el-input>
				</el-form-item>
				<el-form-item prop="pass">
					<el-input type="password" v-model="loginForm.pass" maxlength="32" :placeholder="$t('Please enter password')" autocomplete="off">
						<template slot="prepend">
							<i class="el-icon-lock" style="font-size: 1.25rem;"></i>
						</template>
					</el-input>
				</el-form-item>
				<el-form-item v-show="loginForm.id != '' && loginForm.pass != ''">
					<div style="width: 100%; background-color: #fff;padding: 0.5rem 0;border-radius: 4px;">
						<Verification
							:dataUrl="verificationHost + '/verification/data'"
							:imgPrefix="verificationHost + '/verification/img/'"
							:loadDataErrHandler="verificationErr"
							:clickFinishHandler="verificationFinish"
							ref="verification"
							tipsColor="#666"
							style="margin-left: 0.5rem;"
						/>
					</div>
					<div style="color: white;text-align: center;">
						<span v-if="status == 1" style="color: #409eff;">
							<i class="el-icon-loading"></i>
							{{ $t('Check in') }}...
						</span>
						<span v-else-if="status == 2" style="color: #F56C6C;">{{ $t('The verification code is wrong. Please re select the verification code!') }}</span>
						<span v-else-if="status == 3" style="color: #409eff;">
							<i class="el-icon-loading"></i>
							{{ $t('Logging in') }}...
						</span>
						<span v-else-if="status == 4" style="color: #F56C6C;">{{ $t('Wrong account or password!') }}</span>
						<span v-else-if="status == 5" style="color: #F56C6C;">{{ $t('Request failed, please try again later!') }}</span>
					</div>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
import { apiLogin, apiCheckVerification } from '@/api/Login';
import Verification from './components/VerificationCode.vue';
export default {
	components: { Verification },
	data() {
		var validateId = (rule, value, callback) => {
			if (value.length < 4 || value.length > 32) {
				var tips = this.$t('Please enter a 6-32 account');
				callback(new Error(tips));
			} else {
				callback();
			}
		};
		var validatePass = (rule, value, callback) => {
			if (value.length < 4 || value.length > 32) {
				var tips = this.$t('Please enter a 6-32 password');
				callback(new Error(tips));
			} else {
				callback();
			}
		};

		return {
			loginForm: {
				id: '',
				pass: ''
			},
			rules: {
				id: [{ validator: validateId, trigger: 'blur' }],
				pass: [{ validator: validatePass, trigger: 'blur' }]
			},
			//0=未验证或验证码正确,1=验证码校验中,2=验证码错误,3=正在处理中,4=账号或密码错误,5=操作失败
			status: 0,
			verificationHost: process.env.VUE_APP_BASE_API
		};
	},
	methods: {
		/**
		 * 执行登录
		 * @param {String} index 验证码下表
		 * @param {String} value 验证码
		 */
		loginHandler(index, value) {
			var id = this.loginForm.id;
			var pass = this.loginForm.pass;
			this.$refs.loginForm.validate(Verified => {
				if (Verified) {
					var data = { index: index, value: value, id: id, pass: pass };
					apiLogin(
						data,
						res => {
							console.log('登录成功');
							setTimeout(() => {
								this.$router.push('index');
							}, 1000);
						},
						err => {
							
							console.log('登录失败');
						}
					);
				} else {
					this.status = 0;
					console.log('认证不通过');
				}
			});
		},
		/**
		 * 验证码执行完成
		 * @param {String} index 验证码下表
		 * @param {String} value 验证码
		 */
		verificationFinish(index, value) {
			var tis = this;
			tis.status = 1;
			apiCheckVerification(
				index,
				value,
				res => {
					if (res.data.data === 1) {
						//验证码正确,要执行的事情
						tis.status = 3;
						tis.loginHandler(index, value);
					} else {
						tis.status = 2;
						tis.$refs.verification.reset();
					}
				},
				err => {
					console.log(err);
					tis.status = 5;
					tis.$message({
						type: 'warning',
						message: '检查验证码失败,更多信息请查看控制台!'
					});
				}
			);
		},
		verificationErr(err) {
			this.$message({
				type: 'warning',
				message: '验证获取失败,更多信息请查看控制台!'
			});
			this.status = 5;
			console.log(err);
		}
	}
};
</script>

<style>
.login-container {
	position: absolute;
	width: 100%;
	height: 100%;
	background-color: #283443;
	display: flex;
	align-items: center;
	justify-content: center;
}
.from-box {
	width: 450px;
}

.el-input-group__prepend {
	background-color: #fff;
	border-color: #fff;
}
.el-input__inner::placeholder {
	color: #666;
}
@media (max-width: 450px) {
	.from-box {
		width: 90%;
	}
}
</style>
