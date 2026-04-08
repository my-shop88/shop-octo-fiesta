#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""电商网站完整发布指导书 - 图文版"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image, KeepTogether
from reportlab.lib import colors
from reportlab.lib.units import cm, mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus.flowables import HRFlowable

# 注册中文字体
font_path = '/System/Library/Fonts/STHeiti Light.ttc'
pdfmetrics.registerFont(TTFont('Heiti', font_path, subfontIndex=0))

# 输出路径
output_path = os.path.expanduser('~/Desktop/电商网站/完整发布指导书.pdf')

# 创建文档
doc = SimpleDocTemplate(output_path, pagesize=A4, 
                        leftMargin=2*cm, rightMargin=2*cm,
                        topMargin=2*cm, bottomMargin=2*cm)

# 样式定义
title_style = ParagraphStyle('Title', fontName='Heiti', fontSize=28, alignment=TA_CENTER, spaceAfter=10, textColor=colors.Color(0.1, 0.3, 0.6))
subtitle_style = ParagraphStyle('Subtitle', fontName='Heiti', fontSize=14, alignment=TA_CENTER, spaceAfter=30, textColor=colors.grey)
h1_style = ParagraphStyle('H1', fontName='Heiti', fontSize=20, spaceAfter=12, spaceBefore=20, textColor=colors.Color(0.1, 0.3, 0.6))
h2_style = ParagraphStyle('H2', fontName='Heiti', fontSize=16, spaceAfter=8, spaceBefore=15, textColor=colors.Color(0.2, 0.4, 0.7))
h3_style = ParagraphStyle('H3', fontName='Heiti', fontSize=12, spaceAfter=6, spaceBefore=10, textColor=colors.Color(0.3, 0.3, 0.3))
body_style = ParagraphStyle('Body', fontName='Heiti', fontSize=11, leading=18, spaceAfter=6)
step_style = ParagraphStyle('Step', fontName='Heiti', fontSize=11, leading=18, spaceAfter=4, leftIndent=20)
code_style = ParagraphStyle('Code', fontName='Courier', fontSize=9, leading=14, spaceAfter=4, backColor=colors.Color(0.95, 0.95, 0.95), leftIndent=10, rightIndent=10)
note_style = ParagraphStyle('Note', fontName='Heiti', fontSize=10, leading=16, backColor=colors.Color(0.9, 0.95, 1), spaceAfter=10, leftIndent=10, rightIndent=10)
tip_style = ParagraphStyle('Tip', fontName='Heiti', fontSize=10, leading=16, backColor=colors.Color(1, 0.95, 0.85), spaceAfter=10, leftIndent=10, rightIndent=10)
num_style = ParagraphStyle('Num', fontName='Heiti', fontSize=11, leading=18, spaceAfter=4, bulletIndent=0, leftIndent=25)

story = []

# ==================== 封面 ====================
story.append(Spacer(1, 100))
story.append(Paragraph('电商网站建设与发布', title_style))
story.append(Paragraph('完整操作指导书', title_style))
story.append(Spacer(1, 30))
story.append(Paragraph('从零开始 · 图文详解 · 一步步操作', subtitle_style))
story.append(Spacer(1, 50))

# 目录概览
toc_data = [
    ['章节', '内容', '页码'],
    ['第一部分', '网站建设准备', '2'],
    ['第二部分', '创建电商网站', '4'],
    ['第三部分', 'GitHub 发布（免费）', '8'],
    ['第四部分', 'Vercel 发布（推荐）', '14'],
    ['第五部分', '常见问题解答', '18'],
]
t_toc = Table(toc_data, colWidths=[3*cm, 8*cm, 2*cm])
t_toc.setStyle(TableStyle([
    ('FONTNAME', (0,0), (-1,-1), 'Heiti'),
    ('FONTSIZE', (0,0), (-1,-1), 11),
    ('BACKGROUND', (0,0), (-1,0), colors.Color(0.1, 0.3, 0.6)),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.Color(0.96, 0.96, 0.96)]),
]))
story.append(t_toc)
story.append(Spacer(1, 50))
story.append(Paragraph('适用人群：零基础新手、想快速建站者', body_style))
story.append(Paragraph('所需时间：约 30-60 分钟', body_style))
story.append(Paragraph('所需费用：0 元（免费方案）', body_style))

# ==================== 第一部分 ====================
story.append(PageBreak())
story.append(Paragraph('第一部分：网站建设准备', h1_style))
story.append(HRFlowable(width="100%", thickness=1, color=colors.Color(0.1, 0.3, 0.6)))
story.append(Spacer(1, 15))

story.append(Paragraph('1.1 了解网站的基本组成', h2_style))
story.append(Paragraph('一个网站由以下几部分组成：', body_style))

comp_data = [
    ['组成部分', '说明', '比喻'],
    ['HTML 文件', '网页的骨架，定义内容结构', '像房子的框架'],
    ['CSS 文件', '网页的样式，控制外观', '像房子的装修'],
    ['JavaScript', '网页的交互，实现功能', '像房子的电器'],
    ['图片资源', '网页的视觉元素', '像房子的装饰画'],
]
t_comp = Table(comp_data, colWidths=[3.5*cm, 5.5*cm, 4*cm])
t_comp.setStyle(TableStyle([
    ('FONTNAME', (0,0), (-1,-1), 'Heiti'),
    ('FONTSIZE', (0,0), (-1,-1), 10),
    ('BACKGROUND', (0,0), (-1,0), colors.Color(0.2, 0.4, 0.7)),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
]))
story.append(t_comp)
story.append(Spacer(1, 15))

story.append(Paragraph('1.2 准备工作清单', h2_style))
story.append(Paragraph('在开始之前，请确保准备好以下内容：', body_style))
story.append(Spacer(1, 8))

story.append(Paragraph('✓ 一台电脑（Mac 或 Windows 均可）', step_style))
story.append(Paragraph('✓ 网络连接正常', step_style))
story.append(Paragraph('✓ 一个邮箱地址（用于注册账号）', step_style))
story.append(Paragraph('✓ 浏览器（推荐 Chrome 或 Safari）', step_style))
story.append(Spacer(1, 10))

story.append(Paragraph('💡 小提示：不需要任何编程基础，跟着步骤做即可！', tip_style))

story.append(Paragraph('1.3 文件夹结构说明', h2_style))
story.append(Paragraph('我们创建的电商网站文件夹结构如下：', body_style))
story.append(Spacer(1, 8))
story.append(Paragraph('电商网站/', code_style))
story.append(Paragraph('├── index.html        ← 首页', code_style))
story.append(Paragraph('├── products.html     ← 商品列表页', code_style))
story.append(Paragraph('├── cart.html         ← 购物车页', code_style))
story.append(Paragraph('├── login.html        ← 登录页', code_style))
story.append(Paragraph('├── css/              ← 样式文件夹', code_style))
story.append(Paragraph('│   ├── style.css', code_style))
story.append(Paragraph('│   └── responsive.css', code_style))
story.append(Paragraph('└── js/               ← 脚本文件夹', code_style))
story.append(Paragraph('    └── main.js', code_style))

# ==================== 第二部分 ====================
story.append(PageBreak())
story.append(Paragraph('第二部分：创建电商网站', h1_style))
story.append(HRFlowable(width="100%", thickness=1, color=colors.Color(0.1, 0.3, 0.6)))
story.append(Spacer(1, 15))

story.append(Paragraph('2.1 网站文件已准备就绪', h2_style))
story.append(Paragraph('您的电商网站文件已创建在桌面：', body_style))
story.append(Paragraph('📁 位置：~/Desktop/电商网站/', note_style))
story.append(Spacer(1, 10))

story.append(Paragraph('2.2 本地预览网站', h2_style))
story.append(Paragraph('在发布之前，先在本地查看网站效果：', body_style))
story.append(Spacer(1, 8))

story.append(Paragraph('步骤 1：打开文件夹', h3_style))
story.append(Paragraph('① 在桌面找到「电商网站」文件夹', step_style))
story.append(Paragraph('② 双击打开文件夹', step_style))
story.append(Spacer(1, 8))

story.append(Paragraph('步骤 2：用浏览器打开', h3_style))
story.append(Paragraph('① 找到 index.html 文件', step_style))
story.append(Paragraph('② 右键点击 → 打开方式 → 选择浏览器', step_style))
story.append(Paragraph('③ 或直接双击打开（默认浏览器）', step_style))
story.append(Spacer(1, 10))

story.append(Paragraph('✅ 成功标志：浏览器显示电商网站首页，有轮播图、商品展示等', note_style))

story.append(Paragraph('2.3 网站功能说明', h2_style))
func_data = [
    ['页面', '功能', '文件'],
    ['首页', '轮播广告、分类导航、热门商品', 'index.html'],
    ['商品列表', '分类筛选、排序、分页', 'products.html'],
    ['购物车', '添加商品、修改数量、计算总价', 'cart.html'],
    ['登录页', '用户登录、社交登录', 'login.html'],
]
t_func = Table(func_data, colWidths=[3*cm, 6*cm, 4*cm])
t_func.setStyle(TableStyle([
    ('FONTNAME', (0,0), (-1,-1), 'Heiti'),
    ('FONTSIZE', (0,0), (-1,-1), 10),
    ('BACKGROUND', (0,0), (-1,0), colors.Color(0.2, 0.4, 0.7)),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
]))
story.append(t_func)

# ==================== 第三部分 ====================
story.append(PageBreak())
story.append(Paragraph('第三部分：GitHub 发布（免费方案）', h1_style))
story.append(HRFlowable(width="100%", thickness=1, color=colors.Color(0.1, 0.3, 0.6)))
story.append(Spacer(1, 15))

story.append(Paragraph('这是完全免费的发布方式，适合入门学习。', body_style))
story.append(Spacer(1, 10))

# 步骤1：注册GitHub
story.append(Paragraph('步骤 1：注册 GitHub 账号', h2_style))
story.append(Spacer(1, 8))

story.append(Paragraph('① 打开浏览器，访问：https://github.com', step_style))
story.append(Paragraph('② 点击右上角绿色的「Sign up」按钮', step_style))
story.append(Paragraph('③ 填写注册信息：', step_style))
story.append(Paragraph('   - Email：输入你的邮箱地址', step_style))
story.append(Paragraph('   - Password：设置密码（至少8位）', step_style))
story.append(Paragraph('   - Username：设置用户名（英文）', step_style))
story.append(Paragraph('④ 点击「Create account」', step_style))
story.append(Paragraph('⑤ 完成邮箱验证（去邮箱点击验证链接）', step_style))
story.append(Spacer(1, 10))

story.append(Paragraph('💡 用户名会出现在你的网站地址中，建议用简单的英文名', tip_style))

# 步骤2：创建仓库
story.append(Paragraph('步骤 2：创建代码仓库', h2_style))
story.append(Spacer(1, 8))

story.append(Paragraph('① 登录 GitHub 后，点击右上角「+」号', step_style))
story.append(Paragraph('② 选择「New repository」（新建仓库）', step_style))
story.append(Paragraph('③ 填写仓库信息：', step_style))
story.append(Paragraph('   - Repository name：输入 my-shop', step_style))
story.append(Paragraph('   - Description：输入 我的电商网站（可选）', step_style))
story.append(Paragraph('   - 选择 Public（公开）', step_style))
story.append(Paragraph('   - 勾选「Add a README file」', step_style))
story.append(Paragraph('④ 点击绿色按钮「Create repository」', step_style))
story.append(Spacer(1, 10))

story.append(Paragraph('✅ 成功标志：看到仓库页面，显示 my-shop 名称', note_style))

# 步骤3：上传文件
story.append(PageBreak())
story.append(Paragraph('步骤 3：上传网站文件', h2_style))
story.append(Spacer(1, 8))

story.append(Paragraph('方法一：网页上传（推荐新手）', h3_style))
story.append(Spacer(1, 6))

story.append(Paragraph('① 在仓库页面，点击「Add file」', step_style))
story.append(Paragraph('② 选择「Upload files」', step_style))
story.append(Paragraph('③ 打开桌面的「电商网站」文件夹', step_style))
story.append(Paragraph('④ 将所有文件拖拽到网页上传区域', step_style))
story.append(Paragraph('   包括：index.html、products.html 等', step_style))
story.append(Paragraph('⑤ 在下方 Commit changes 处：', step_style))
story.append(Paragraph('   - 输入提交信息：发布电商网站', step_style))
story.append(Paragraph('⑥ 点击绿色「Commit changes」按钮', step_style))
story.append(Spacer(1, 10))

story.append(Paragraph('⚠️ 注意：要上传文件夹内的所有文件，不是文件夹本身', note_style))

story.append(Paragraph('方法二：命令行上传（适合有经验者）', h3_style))
story.append(Spacer(1, 6))
story.append(Paragraph('# 打开终端，依次执行：', code_style))
story.append(Paragraph('git clone https://github.com/你的用户名/my-shop.git', code_style))
story.append(Paragraph('cd my-shop', code_style))
story.append(Paragraph('# 复制网站文件到此目录', code_style))
story.append(Paragraph('git add .', code_style))
story.append(Paragraph('git commit -m "发布电商网站"', code_style))
story.append(Paragraph('git push', code_style))

# 步骤4：开启Pages
story.append(PageBreak())
story.append(Paragraph('步骤 4：开启 GitHub Pages', h2_style))
story.append(Spacer(1, 8))

story.append(Paragraph('① 在仓库页面，点击顶部的「Settings」（设置）', step_style))
story.append(Paragraph('② 在左侧菜单找到「Pages」，点击进入', step_style))
story.append(Paragraph('③ 在 Build and deployment 部分：', step_style))
story.append(Paragraph('   - Source：选择「Deploy from a branch」', step_style))
story.append(Paragraph('   - Branch：选择「main」', step_style))
story.append(Paragraph('   - Folder：选择「/ (root)」', step_style))
story.append(Paragraph('④ 点击「Save」保存', step_style))
story.append(Spacer(1, 10))

story.append(Paragraph('⏳ 等待 1-2 分钟，GitHub 正在部署你的网站...', note_style))

# 步骤5：访问网站
story.append(Paragraph('步骤 5：访问你的网站', h2_style))
story.append(Spacer(1, 8))

story.append(Paragraph('① 刷新 Pages 设置页面', step_style))
story.append(Paragraph('② 你会看到类似这样的提示：', step_style))
story.append(Spacer(1, 6))
story.append(Paragraph('🎉 Your site is live at https://你的用户名.github.io/my-shop/', note_style))
story.append(Spacer(1, 6))
story.append(Paragraph('③ 点击链接，查看你的网站！', step_style))
story.append(Paragraph('④ 将这个链接分享给朋友，他们就能访问了', step_style))
story.append(Spacer(1, 15))

story.append(Paragraph('🎊 恭喜！你的网站已经成功发布到互联网上了！', tip_style))

# ==================== 第四部分 ====================
story.append(PageBreak())
story.append(Paragraph('第四部分：Vercel 发布（推荐方案）', h1_style))
story.append(HRFlowable(width="100%", thickness=1, color=colors.Color(0.1, 0.3, 0.6)))
story.append(Spacer(1, 15))

story.append(Paragraph('Vercel 部署更简单，支持自定义域名，推荐使用。', body_style))
story.append(Spacer(1, 10))

story.append(Paragraph('步骤 1：注册 Vercel 账号', h2_style))
story.append(Spacer(1, 8))

story.append(Paragraph('① 访问：https://vercel.com', step_style))
story.append(Paragraph('② 点击「Sign Up」注册', step_style))
story.append(Paragraph('③ 选择「Continue with GitHub」', step_style))
story.append(Paragraph('④ 授权 Vercel 访问你的 GitHub', step_style))
story.append(Spacer(1, 10))

story.append(Paragraph('步骤 2：导入项目', h2_style))
story.append(Spacer(1, 8))

story.append(Paragraph('① 登录后，点击「Add New...」→「Project」', step_style))
story.append(Paragraph('② 在 Import Git Repository 页面', step_style))
story.append(Paragraph('③ 找到你的 my-shop 仓库', step_style))
story.append(Paragraph('④ 点击「Import」导入', step_style))
story.append(Spacer(1, 10))

story.append(Paragraph('步骤 3：配置并部署', h2_style))
story.append(Spacer(1, 8))

story.append(Paragraph('① Framework Preset：选择「Other」', step_style))
story.append(Paragraph('② Root Directory：保持默认 ./', step_style))
story.append(Paragraph('③ Build Command：留空', step_style))
story.append(Paragraph('④ Output Directory：留空', step_style))
story.append(Paragraph('⑤ 点击「Deploy」开始部署', step_style))
story.append(Spacer(1, 10))

story.append(Paragraph('⏳ 等待约 1 分钟，部署完成！', note_style))

story.append(Paragraph('步骤 4：获取网站地址', h2_style))
story.append(Spacer(1, 8))

story.append(Paragraph('① 部署成功后，Vercel 会给你一个地址', step_style))
story.append(Paragraph('   格式：https://my-shop-xxx.vercel.app', step_style))
story.append(Paragraph('② 点击「Visit」访问你的网站', step_style))
story.append(Spacer(1, 10))

story.append(Paragraph('步骤 5：绑定自定义域名（可选）', h2_style))
story.append(Spacer(1, 8))

story.append(Paragraph('如果你购买了域名，可以这样绑定：', body_style))
story.append(Paragraph('① 在项目页面，点击「Settings」', step_style))
story.append(Paragraph('② 选择「Domains」', step_style))
story.append(Paragraph('③ 输入你的域名，点击「Add」', step_style))
story.append(Paragraph('④ 按提示在域名服务商处配置 DNS', step_style))

# DNS配置表格
story.append(PageBreak())
story.append(Paragraph('DNS 配置参考：', h3_style))
dns_data = [
    ['类型', '名称', '值'],
    ['A', '@', '76.76.21.21'],
    ['CNAME', 'www', 'cname.vercel-dns.com'],
]
t_dns = Table(dns_data, colWidths=[3*cm, 3*cm, 7*cm])
t_dns.setStyle(TableStyle([
    ('FONTNAME', (0,0), (-1,-1), 'Heiti'),
    ('FONTSIZE', (0,0), (-1,-1), 10),
    ('BACKGROUND', (0,0), (-1,0), colors.Color(0.2, 0.4, 0.7)),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
]))
story.append(t_dns)

# ==================== 第五部分 ====================
story.append(PageBreak())
story.append(Paragraph('第五部分：常见问题解答', h1_style))
story.append(HRFlowable(width="100%", thickness=1, color=colors.Color(0.1, 0.3, 0.6)))
story.append(Spacer(1, 15))

story.append(Paragraph('Q1：网站更新后怎么重新发布？', h2_style))
story.append(Paragraph('方法一：网页更新', h3_style))
story.append(Paragraph('① 进入 GitHub 仓库', step_style))
story.append(Paragraph('② 点击要修改的文件', step_style))
story.append(Paragraph('③ 点击铅笔图标编辑', step_style))
story.append(Paragraph('④ 修改后点击「Commit changes」', step_style))
story.append(Spacer(1, 8))

story.append(Paragraph('方法二：命令行更新', h3_style))
story.append(Paragraph('git add .', code_style))
story.append(Paragraph('git commit -m "更新内容"', code_style))
story.append(Paragraph('git push', code_style))
story.append(Spacer(1, 6))
story.append(Paragraph('Vercel 和 GitHub Pages 都会自动重新部署。', body_style))

story.append(Paragraph('Q2：网站访问不了怎么办？', h2_style))
story.append(Paragraph('① 检查文件是否上传完整', step_style))
story.append(Paragraph('② 检查 index.html 是否在根目录', step_style))
story.append(Paragraph('③ 等待 2-3 分钟再试', step_style))
story.append(Paragraph('④ 检查 Pages 设置是否正确', step_style))

story.append(Paragraph('Q3：可以绑定自己的域名吗？', h2_style))
story.append(Paragraph('可以！需要：', body_style))
story.append(Paragraph('① 购买域名（阿里云、腾讯云等）', step_style))
story.append(Paragraph('② 在 Vercel 或 GitHub Pages 添加域名', step_style))
story.append(Paragraph('③ 在域名服务商配置 DNS 解析', step_style))

story.append(Paragraph('Q4：需要备案吗？', h2_style))
story.append(Paragraph('• 使用 GitHub/Vercel：不需要备案', body_style))
story.append(Paragraph('• 使用国内服务器：需要备案（7-20天）', body_style))

story.append(Paragraph('Q5：免费方案有限制吗？', h2_style))
limit_data = [
    ['平台', '流量', '带宽', '构建次数'],
    ['GitHub Pages', '100GB/月', '不限', '不限'],
    ['Vercel 免费版', '100GB/月', '1Mbps', '不限'],
]
t_limit = Table(limit_data, colWidths=[4*cm, 3*cm, 3*cm, 3*cm])
t_limit.setStyle(TableStyle([
    ('FONTNAME', (0,0), (-1,-1), 'Heiti'),
    ('FONTSIZE', (0,0), (-1,-1), 10),
    ('BACKGROUND', (0,0), (-1,0), colors.Color(0.2, 0.4, 0.7)),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
]))
story.append(t_limit)

# 总结
story.append(PageBreak())
story.append(Paragraph('总结', h1_style))
story.append(HRFlowable(width="100%", thickness=1, color=colors.Color(0.1, 0.3, 0.6)))
story.append(Spacer(1, 15))

story.append(Paragraph('恭喜你完成了电商网站的建设与发布！', body_style))
story.append(Spacer(1, 10))

story.append(Paragraph('回顾一下我们做了什么：', h2_style))
story.append(Paragraph('✅ 了解了网站的基本组成', step_style))
story.append(Paragraph('✅ 创建了完整的电商网站', step_style))
story.append(Paragraph('✅ 注册了 GitHub/Vercel 账号', step_style))
story.append(Paragraph('✅ 将网站发布到了互联网', step_style))
story.append(Paragraph('✅ 学会了更新和维护网站', step_style))
story.append(Spacer(1, 15))

# 推荐路径
story.append(Paragraph('后续学习建议：', h2_style))
learn_data = [
    ['阶段', '内容', '时间'],
    ['入门', 'HTML/CSS 基础', '1-2周'],
    ['进阶', 'JavaScript 交互', '2-4周'],
    ['高级', '后端开发、数据库', '1-2月'],
]
t_learn = Table(learn_data, colWidths=[3*cm, 6*cm, 4*cm])
t_learn.setStyle(TableStyle([
    ('FONTNAME', (0,0), (-1,-1), 'Heiti'),
    ('FONTSIZE', (0,0), (-1,-1), 10),
    ('BACKGROUND', (0,0), (-1,0), colors.Color(0.2, 0.4, 0.7)),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
]))
story.append(t_learn)
story.append(Spacer(1, 20))

story.append(Paragraph('🌐 现在就把你的网站分享给朋友吧！', tip_style))

# 生成 PDF
doc.build(story)
print(f'PDF 已生成：{output_path}')