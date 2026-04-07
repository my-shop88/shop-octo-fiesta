#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""零基础学建网完整教程"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus.flowables import HRFlowable

# 注册中文字体
font_path = '/System/Library/Fonts/STHeiti Light.ttc'
pdfmetrics.registerFont(TTFont('Heiti', font_path, subfontIndex=0))

# 输出路径
output_path = os.path.expanduser('~/Desktop/电商网站/零基础学建网教程.pdf')

# 创建文档
doc = SimpleDocTemplate(output_path, pagesize=A4, 
                        leftMargin=2*cm, rightMargin=2*cm,
                        topMargin=2*cm, bottomMargin=2*cm)

# 样式
title_style = ParagraphStyle('Title', fontName='Heiti', fontSize=28, alignment=TA_CENTER, spaceAfter=10, textColor=colors.Color(0.1, 0.3, 0.6))
subtitle_style = ParagraphStyle('Subtitle', fontName='Heiti', fontSize=14, alignment=TA_CENTER, spaceAfter=30, textColor=colors.grey)
h1_style = ParagraphStyle('H1', fontName='Heiti', fontSize=20, spaceAfter=12, spaceBefore=20, textColor=colors.Color(0.1, 0.3, 0.6))
h2_style = ParagraphStyle('H2', fontName='Heiti', fontSize=16, spaceAfter=8, spaceBefore=15, textColor=colors.Color(0.2, 0.4, 0.7))
h3_style = ParagraphStyle('H3', fontName='Heiti', fontSize=13, spaceAfter=6, spaceBefore=10, textColor=colors.Color(0.3, 0.3, 0.3))
body_style = ParagraphStyle('Body', fontName='Heiti', fontSize=11, leading=18, spaceAfter=6)
step_style = ParagraphStyle('Step', fontName='Heiti', fontSize=11, leading=18, spaceAfter=4, leftIndent=15)
code_style = ParagraphStyle('Code', fontName='Courier', fontSize=9, leading=14, spaceAfter=4, backColor=colors.Color(0.95, 0.95, 0.95), leftIndent=10, rightIndent=10)
note_style = ParagraphStyle('Note', fontName='Heiti', fontSize=10, leading=16, backColor=colors.Color(0.9, 0.95, 1), spaceAfter=10, leftIndent=10, rightIndent=10)
tip_style = ParagraphStyle('Tip', fontName='Heiti', fontSize=10, leading=16, backColor=colors.Color(1, 0.95, 0.85), spaceAfter=10, leftIndent=10, rightIndent=10)

story = []

# 封面
story.append(Spacer(1, 80))
story.append(Paragraph('零基础学建网', title_style))
story.append(Paragraph('完整学习教程', title_style))
story.append(Spacer(1, 30))
story.append(Paragraph('从零开始 · 系统学习 · 实战练习', subtitle_style))
story.append(Spacer(1, 40))

roadmap_data = [
    ['阶段', '学习内容', '时间', '难度'],
    ['第1周', 'HTML 基础', '7天', '简单'],
    ['第2周', 'CSS 样式', '7天', '中等'],
    ['第3周', 'JavaScript 入门', '7天', '较难'],
    ['第4周', '实战项目', '7天', '综合'],
]
t_road = Table(roadmap_data, colWidths=[2.5*cm, 5*cm, 2.5*cm, 3*cm])
t_road.setStyle(TableStyle([
    ('FONTNAME', (0,0), (-1,-1), 'Heiti'),
    ('FONTSIZE', (0,0), (-1,-1), 11),
    ('BACKGROUND', (0,0), (-1,0), colors.Color(0.1, 0.3, 0.6)),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
]))
story.append(t_road)
story.append(Spacer(1, 30))
story.append(Paragraph('适合人群：完全零基础、想系统学习建网者', body_style))
story.append(Paragraph('学习目标：能独立制作简单的网页和网站', body_style))

# 第一章
story.append(PageBreak())
story.append(Paragraph('第一章：认识网页', h1_style))
story.append(HRFlowable(width="100%", thickness=1, color=colors.Color(0.1, 0.3, 0.6)))
story.append(Spacer(1, 15))

story.append(Paragraph('1.1 什么是网页？', h2_style))
story.append(Paragraph('网页就像一张电子文档，可以在浏览器中查看。你每天看的新闻、购物网站、视频网站，都是由网页组成的。', body_style))
story.append(Spacer(1, 10))

story.append(Paragraph('网页的三个核心要素：', h3_style))
core_data = [
    ['要素', '作用', '比喻'],
    ['HTML', '定义内容结构', '房子的框架'],
    ['CSS', '控制外观样式', '房子的装修'],
    ['JavaScript', '实现交互功能', '房子的电器'],
]
t_core = Table(core_data, colWidths=[3*cm, 5*cm, 5*cm])
t_core.setStyle(TableStyle([
    ('FONTNAME', (0,0), (-1,-1), 'Heiti'),
    ('FONTSIZE', (0,0), (-1,-1), 10),
    ('BACKGROUND', (0,0), (-1,0), colors.Color(0.2, 0.4, 0.7)),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
]))
story.append(t_core)
story.append(Spacer(1, 15))

story.append(Paragraph('1.2 学习建网需要什么工具？', h2_style))
tool_data = [
    ['工具', '用途', '推荐'],
    ['浏览器', '查看网页效果', 'Chrome、Edge'],
    ['代码编辑器', '编写代码', 'VS Code（免费）'],
    ['文件管理器', '管理网站文件', '系统自带'],
]
t_tool = Table(tool_data, colWidths=[3*cm, 5*cm, 5*cm])
t_tool.setStyle(TableStyle([
    ('FONTNAME', (0,0), (-1,-1), 'Heiti'),
    ('FONTSIZE', (0,0), (-1,-1), 10),
    ('BACKGROUND', (0,0), (-1,0), colors.Color(0.2, 0.4, 0.7)),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
]))
story.append(t_tool)

# 第二章 HTML
story.append(PageBreak())
story.append(Paragraph('第二章：HTML 基础（第1周）', h1_style))
story.append(HRFlowable(width="100%", thickness=1, color=colors.Color(0.1, 0.3, 0.6)))
story.append(Spacer(1, 15))

story.append(Paragraph('2.1 什么是 HTML？', h2_style))
story.append(Paragraph('HTML = 超文本标记语言，用"标签"告诉浏览器这里是什么内容。', body_style))
story.append(Spacer(1, 10))

story.append(Paragraph('比如：', h3_style))
story.append(Paragraph('<h1>这是一级标题</h1>', code_style))
story.append(Paragraph('<p>这是一个段落</p>', code_style))
story.append(Paragraph('&lt;img src="photo.jpg"&gt; 这是一张图片', code_style))

story.append(Paragraph('2.2 HTML 文件的基本结构', h2_style))
story.append(Paragraph('<!DOCTYPE html>', code_style))
story.append(Paragraph('<html>', code_style))
story.append(Paragraph('<head>', code_style))
story.append(Paragraph('  <title>网页标题</title>', code_style))
story.append(Paragraph('</head>', code_style))
story.append(Paragraph('<body>', code_style))
story.append(Paragraph('  网页内容写在这里', code_style))
story.append(Paragraph('</body>', code_style))
story.append(Paragraph('</html>', code_style))

story.append(Paragraph('2.3 最常用的 HTML 标签', h2_style))
tag_data = [
    ['标签', '作用', '示例'],
    ['<h1>~<h6>', '标题', '<h1>大标题</h1>'],
    ['<p>', '段落', '<p>文字</p>'],
    ['<a>', '链接', '<a href="url">点击</a>'],
    ['<img>', '图片', '<img src="地址">'],
    ['<div>', '容器', '<div>内容</div>'],
    ['<button>', '按钮', '<button>点击</button>'],
]
t_tag = Table(tag_data, colWidths=[3*cm, 4*cm, 6*cm])
t_tag.setStyle(TableStyle([
    ('FONTNAME', (0,0), (-1,-1), 'Heiti'),
    ('FONTSIZE', (0,0), (-1,-1), 9),
    ('BACKGROUND', (0,0), (-1,0), colors.Color(0.2, 0.4, 0.7)),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
]))
story.append(t_tag)

story.append(Paragraph('2.4 动手练习：创建第一个网页', h2_style))
story.append(Paragraph('步骤1：在桌面新建文件夹 my-first-web', step_style))
story.append(Paragraph('步骤2：新建文件 index.html，输入以下代码：', step_style))
story.append(Paragraph('<!DOCTYPE html>', code_style))
story.append(Paragraph('<html><head><title>我的网页</title></head>', code_style))
story.append(Paragraph('<body>', code_style))
story.append(Paragraph('  <h1>欢迎来到我的网页</h1>', code_style))
story.append(Paragraph('  <p>这是我第一次写网页！</p>', code_style))
story.append(Paragraph('</body></html>', code_style))
story.append(Paragraph('步骤3：双击 index.html 用浏览器打开查看效果', step_style))
story.append(Spacer(1, 10))
story.append(Paragraph('恭喜！你已经创建了第一个网页！', note_style))

# 第三章 CSS
story.append(PageBreak())
story.append(Paragraph('第三章：CSS 基础（第2周）', h1_style))
story.append(HRFlowable(width="100%", thickness=1, color=colors.Color(0.1, 0.3, 0.6)))
story.append(Spacer(1, 15))

story.append(Paragraph('3.1 什么是 CSS？', h2_style))
story.append(Paragraph('CSS = 层叠样式表，控制网页长什么样（颜色、大小、位置等）。', body_style))
story.append(Paragraph('HTML 决定"有什么"，CSS 决定"长什么样"', note_style))

story.append(Paragraph('3.2 CSS 基本语法', h2_style))
story.append(Paragraph('选择器 { 属性: 值; }', code_style))
story.append(Paragraph('p { color: red; font-size: 20px; }', code_style))

story.append(Paragraph('3.3 常用 CSS 属性', h2_style))
css_data = [
    ['属性', '作用', '示例'],
    ['color', '文字颜色', 'red, #ff0000'],
    ['font-size', '文字大小', '16px, 1.2em'],
    ['background', '背景', 'blue, url(bg.jpg)'],
    ['width/height', '宽高', '200px, 100%'],
    ['margin', '外边距', '10px'],
    ['padding', '内边距', '10px'],
    ['border', '边框', '1px solid black'],
]
t_css = Table(css_data, colWidths=[3*cm, 3*cm, 7*cm])
t_css.setStyle(TableStyle([
    ('FONTNAME', (0,0), (-1,-1), 'Heiti'),
    ('FONTSIZE', (0,0), (-1,-1), 9),
    ('BACKGROUND', (0,0), (-1,0), colors.Color(0.2, 0.4, 0.7)),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
]))
story.append(t_css)

story.append(Paragraph('3.4 使用 CSS 的三种方式', h2_style))
story.append(Paragraph('方式1：行内样式 <p style="color:red;">', code_style))
story.append(Paragraph('方式2：内部样式 <style>p{color:red;}</style>', code_style))
story.append(Paragraph('方式3：外部样式（推荐）&lt;link rel="stylesheet" href="style.css"&gt;', code_style))

# 第四章 JavaScript
story.append(PageBreak())
story.append(Paragraph('第四章：JavaScript 入门（第3周）', h1_style))
story.append(HRFlowable(width="100%", thickness=1, color=colors.Color(0.1, 0.3, 0.6)))
story.append(Spacer(1, 15))

story.append(Paragraph('4.1 什么是 JavaScript？', h2_style))
story.append(Paragraph('JavaScript = 让网页"动起来"的编程语言', body_style))
story.append(Paragraph('能做：点击按钮弹出提示、轮播图、表单验证、数据计算等', body_style))

story.append(Paragraph('4.2 JavaScript 基础语法', h2_style))
story.append(Paragraph('// 变量', code_style))
story.append(Paragraph('let name = "小明";', code_style))
story.append(Paragraph('let age = 18;', code_style))
story.append(Paragraph('', code_style))
story.append(Paragraph('// 函数', code_style))
story.append(Paragraph('function sayHello() {', code_style))
story.append(Paragraph('  alert("你好！");', code_style))
story.append(Paragraph('}', code_style))
story.append(Paragraph('', code_style))
story.append(Paragraph('// 条件判断', code_style))
story.append(Paragraph('if (age >= 18) { alert("成年人"); }', code_style))

story.append(Paragraph('4.3 操作网页元素', h2_style))
story.append(Paragraph('// 获取元素', code_style))
story.append(Paragraph('let btn = document.getElementById("myBtn");', code_style))
story.append(Paragraph('// 修改内容', code_style))
story.append(Paragraph('document.getElementById("title").innerHTML = "新标题";', code_style))
story.append(Paragraph('// 修改样式', code_style))
story.append(Paragraph('document.getElementById("box").style.color = "red";', code_style))

# 第五章 学习资源
story.append(PageBreak())
story.append(Paragraph('第五章：学习资源推荐', h1_style))
story.append(HRFlowable(width="100%", thickness=1, color=colors.Color(0.1, 0.3, 0.6)))
story.append(Spacer(1, 15))

story.append(Paragraph('5.1 在线教程网站', h2_style))
res_data = [
    ['网站', '特点', '网址'],
    ['MDN Web Docs', '权威详细', 'developer.mozilla.org'],
    ['W3Schools', '简单易懂', 'w3schools.com'],
    ['菜鸟教程', '中文易懂', 'runoob.com'],
    ['freeCodeCamp', '免费实战', 'freecodecamp.org'],
]
t_res = Table(res_data, colWidths=[4*cm, 4*cm, 5*cm])
t_res.setStyle(TableStyle([
    ('FONTNAME', (0,0), (-1,-1), 'Heiti'),
    ('FONTSIZE', (0,0), (-1,-1), 10),
    ('BACKGROUND', (0,0), (-1,0), colors.Color(0.2, 0.4, 0.7)),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
]))
story.append(t_res)
story.append(Spacer(1, 15))

story.append(Paragraph('5.2 视频教程平台', h2_style))
story.append(Paragraph('• B站：搜索"HTML CSS 零基础"', step_style))
story.append(Paragraph('• YouTube：搜索"Web Development for Beginners"', step_style))
story.append(Paragraph('• 慕课网：搜索"前端入门"', step_style))
story.append(Spacer(1, 15))

story.append(Paragraph('5.3 学习建议', h2_style))
story.append(Paragraph('① 每天坚持学习 1-2 小时', step_style))
story.append(Paragraph('② 边学边练，不要只看不练', step_style))
story.append(Paragraph('③ 遇到问题先自己思考，再查资料', step_style))
story.append(Paragraph('④ 多看别人的代码，学习技巧', step_style))
story.append(Paragraph('⑤ 做笔记，记录学到的知识', step_style))
story.append(Spacer(1, 15))

story.append(Paragraph('祝你学习顺利！', tip_style))

# 生成 PDF
doc.build(story)
print(f'PDF 已生成：{output_path}')