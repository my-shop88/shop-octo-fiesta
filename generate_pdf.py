#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成电商网站发布指南 PDF"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# 注册中文字体
font_path = '/System/Library/Fonts/STHeiti Light.ttc'
pdfmetrics.registerFont(TTFont('Heiti', font_path, subfontIndex=0))

# 输出路径
output_path = os.path.expanduser('~/Desktop/电商网站/发布指南.pdf')

# 创建文档
doc = SimpleDocTemplate(output_path, pagesize=A4, 
                        leftMargin=2*cm, rightMargin=2*cm,
                        topMargin=2*cm, bottomMargin=2*cm)

# 样式
styles = getSampleStyleSheet()

title_style = ParagraphStyle('Title', fontName='Heiti', fontSize=24, alignment=TA_CENTER, spaceAfter=30)
h1_style = ParagraphStyle('H1', fontName='Heiti', fontSize=18, spaceAfter=12, spaceBefore=20)
h2_style = ParagraphStyle('H2', fontName='Heiti', fontSize=14, spaceAfter=8, spaceBefore=15)
h3_style = ParagraphStyle('H3', fontName='Heiti', fontSize=12, spaceAfter=6, spaceBefore=10)
body_style = ParagraphStyle('Body', fontName='Heiti', fontSize=10, leading=16, spaceAfter=6)
code_style = ParagraphStyle('Code', fontName='Courier', fontSize=9, leading=12, spaceAfter=6, 
                            backColor=colors.Color(0.95, 0.95, 0.95))
note_style = ParagraphStyle('Note', fontName='Heiti', fontSize=10, leading=14, 
                            backColor=colors.Color(1, 0.95, 0.9), spaceAfter=8)

story = []

# 标题
story.append(Paragraph('网站发布操作指导书', title_style))
story.append(Paragraph('将本地电商网站发布到互联网的完整指南', body_style))
story.append(Spacer(1, 20))

# 方案对比
story.append(Paragraph('一、方案对比', h1_style))

table_data = [
    ['方案', '费用', '域名', '优点', '缺点'],
    ['GitHub Pages', '免费', '需绑定', '完全免费、速度快', '需会Git操作'],
    ['Vercel', '免费版免费', '可自定义', '部署简单', '国内访问稍慢'],
    ['Netlify', '免费版免费', '可自定义', '功能强大', '国内访问稍慢'],
    ['阿里云/腾讯云', '50元起/年', '支持', '国内访问快', '需备案'],
]
t = Table(table_data, colWidths=[2.5*cm, 2.5*cm, 2.5*cm, 4*cm, 3*cm])
t.setStyle(TableStyle([
    ('FONTNAME', (0,0), (-1,-1), 'Heiti'),
    ('FONTSIZE', (0,0), (-1,-1), 9),
    ('BACKGROUND', (0,0), (-1,0), colors.Color(0.2, 0.4, 0.8)),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.Color(0.95, 0.95, 0.95)]),
]))
story.append(t)
story.append(Spacer(1, 20))

# 方案一
story.append(Paragraph('二、方案一：GitHub Pages（推荐入门）', h1_style))

story.append(Paragraph('准备工作', h2_style))
story.append(Paragraph('1. 注册 GitHub 账号：访问 https://github.com，点击 Sign up 注册', body_style))
story.append(Paragraph('2. 安装 Git：Mac 已自带，打开终端输入 git --version 检查', body_style))

story.append(Paragraph('步骤 1：创建代码仓库', h2_style))
story.append(Paragraph('1. 登录 GitHub，点击右上角 + → New repository', body_style))
story.append(Paragraph('2. Repository name 填写：my-shop', body_style))
story.append(Paragraph('3. 选择 Public，勾选 Add a README file', body_style))
story.append(Paragraph('4. 点击 Create repository', body_style))

story.append(Paragraph('步骤 2：上传网站文件（网页上传方式）', h2_style))
story.append(Paragraph('1. 进入刚创建的仓库页面', body_style))
story.append(Paragraph('2. 点击 Add file → Upload files', body_style))
story.append(Paragraph('3. 将本地电商网站文件夹内的所有文件拖入上传', body_style))
story.append(Paragraph('4. 填写提交信息：Initial upload', body_style))
story.append(Paragraph('5. 点击 Commit changes', body_style))

story.append(Paragraph('步骤 3：开启 GitHub Pages', h2_style))
story.append(Paragraph('1. 进入仓库页面 → 点击 Settings', body_style))
story.append(Paragraph('2. 左侧点击 Pages', body_style))
story.append(Paragraph('3. Source 选择 Deploy from a branch', body_style))
story.append(Paragraph('4. Branch 选择 main，Folder 选择 / (root)', body_style))
story.append(Paragraph('5. 点击 Save', body_style))
story.append(Paragraph('6. 等待 1-2 分钟，刷新页面查看网站地址', body_style))

story.append(Paragraph('网站地址格式：https://你的用户名.github.io/my-shop/', note_style))

# 方案二
story.append(PageBreak())
story.append(Paragraph('三、方案二：Vercel 部署（推荐）', h1_style))

story.append(Paragraph('步骤 1：购买域名（可选）', h2_style))
story.append(Paragraph('国内平台：阿里云 https://wanwang.aliyun.com（.com 约 50-80元/年）', body_style))
story.append(Paragraph('国外平台：Namecheap https://namecheap.com（约 $10-15/年）', body_style))

story.append(Paragraph('步骤 2：通过 Vercel 部署', h2_style))
story.append(Paragraph('1. 注册 Vercel：https://vercel.com', body_style))
story.append(Paragraph('2. 点击 Add New → Project', body_style))
story.append(Paragraph('3. 选择 Continue with GitHub', body_style))
story.append(Paragraph('4. 选择你的电商网站仓库', body_style))
story.append(Paragraph('5. Framework Preset 选择 Other', body_style))
story.append(Paragraph('6. 点击 Deploy', body_style))
story.append(Paragraph('7. 部署完成后，点击 Domains 添加你的域名', body_style))

story.append(Paragraph('步骤 3：域名解析配置', h2_style))
dns_data = [
    ['类型', '主机记录', '记录值'],
    ['A', '@', '76.76.21.21'],
    ['CNAME', 'www', 'cname.vercel-dns.com'],
]
t2 = Table(dns_data, colWidths=[3*cm, 3*cm, 6*cm])
t2.setStyle(TableStyle([
    ('FONTNAME', (0,0), (-1,-1), 'Heiti'),
    ('FONTSIZE', (0,0), (-1,-1), 9),
    ('BACKGROUND', (0,0), (-1,0), colors.Color(0.2, 0.4, 0.8)),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
]))
story.append(t2)
story.append(Spacer(1, 15))

# 方案三
story.append(Paragraph('四、方案三：国内备案方案', h1_style))

story.append(Paragraph('适用情况：服务器在国内（阿里云、腾讯云等）', note_style))

story.append(Paragraph('备案流程', h2_style))
story.append(Paragraph('1. 购买域名和服务器（阿里云或腾讯云）', body_style))
story.append(Paragraph('2. 登录对应平台的备案系统', body_style))
story.append(Paragraph('3. 填写网站信息，上传身份证照片', body_style))
story.append(Paragraph('4. 填写核验单（需打印签字）', body_style))
story.append(Paragraph('5. 等待审核：初审 1-2 个工作日，管局审核 7-20 个工作日', body_style))
story.append(Paragraph('6. 备案成功后获得备案号，放在网站底部', body_style))

# 常见问题
story.append(PageBreak())
story.append(Paragraph('五、常见问题', h1_style))

story.append(Paragraph('Q1：网站需要 HTTPS 吗？', h2_style))
story.append(Paragraph('建议添加。Vercel/Netlify 自动提供免费 HTTPS，GitHub Pages 需手动配置。', body_style))

story.append(Paragraph('Q2：网站有访问量限制吗？', h2_style))
limit_data = [
    ['平台', '每月流量限制'],
    ['GitHub Pages', '100GB'],
    ['Vercel 免费版', '100GB'],
    ['Netlify 免费版', '100GB'],
]
t3 = Table(limit_data, colWidths=[5*cm, 5*cm])
t3.setStyle(TableStyle([
    ('FONTNAME', (0,0), (-1,-1), 'Heiti'),
    ('FONTSIZE', (0,0), (-1,-1), 9),
    ('BACKGROUND', (0,0), (-1,0), colors.Color(0.2, 0.4, 0.8)),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
]))
story.append(t3)
story.append(Spacer(1, 15))

story.append(Paragraph('Q3：网站更新后如何重新发布？', h2_style))
story.append(Paragraph('本地更新后执行以下命令：', body_style))
story.append(Paragraph('git add .', code_style))
story.append(Paragraph('git commit -m "更新内容"', code_style))
story.append(Paragraph('git push', code_style))
story.append(Paragraph('Vercel/GitHub 会自动重新部署。', body_style))

# 推荐组合
story.append(Paragraph('六、推荐组合', h1_style))
rec_data = [
    ['预算', '推荐方案'],
    ['0元', 'GitHub Pages'],
    ['50元/年', '买域名 + Vercel 免费版'],
    ['200元/年', '阿里云/腾讯云 + 域名（需备案）'],
]
t4 = Table(rec_data, colWidths=[4*cm, 8*cm])
t4.setStyle(TableStyle([
    ('FONTNAME', (0,0), (-1,-1), 'Heiti'),
    ('FONTSIZE', (0,0), (-1,-1), 9),
    ('BACKGROUND', (0,0), (-1,0), colors.Color(0.2, 0.4, 0.8)),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
]))
story.append(t4)
story.append(Spacer(1, 20))

# 快速开始
story.append(Paragraph('七、快速开始命令（Mac 用户）', h1_style))
story.append(Paragraph('# 1. 配置 Git', code_style))
story.append(Paragraph('git config --global user.name "你的名字"', code_style))
story.append(Paragraph('git config --global user.email "你的邮箱"', code_style))
story.append(Spacer(1, 6))
story.append(Paragraph('# 2. 克隆仓库并部署', code_style))
story.append(Paragraph('git clone https://github.com/你的用户名/my-shop.git', code_style))
story.append(Paragraph('cp -R ~/Desktop/电商网站/* ~/my-shop/', code_style))
story.append(Paragraph('cd my-shop', code_style))
story.append(Paragraph('git add .', code_style))
story.append(Paragraph('git commit -m "发布电商网站"', code_style))
story.append(Paragraph('git push', code_style))

story.append(Spacer(1, 30))
story.append(Paragraph('完成后，你的网站就可以通过 URL 分享给任何人访问了！', note_style))

# 生成 PDF
doc.build(story)
print(f'PDF 已生成：{output_path}')