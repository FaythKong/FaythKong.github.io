---
title: Leetcode-69
author: FaythKong
tags: 
  - Leetcode
categories: 
  - Leetcode刷题
  - 简单
date: 2024-7-14
top: 96
---

## 69. x 的平方根
  给你一个非负整数 x ，计算并返回 x 的 算术平方根。由于返回类型是整数，结果只保留整数部分，小数部分将被舍去。 注意：不允许使用任何内置指数函数和算符，例如 pow(x, 0.5)或者x ** 0.5。

示例 1：
输入：x = 4
输出：2

示例 2：
输入：x = 8
输出：2
解释：8 的算术平方根是 2.82842..., 由于返回类型是整数，小数部分将被舍去。

### 思路
<!--more-->
暴力递增，超过则返回-1的结果，等于则直接返回结果。
mark：变量要使用long long int.
### 代码
``` bash
class Solution {
public:
    int mySqrt(int x) {
        if(x==0) return 0;
        else if(x==1) return 1;
        else
        {
        long long int a=1;
        while(a*a<x)
        a+=1;
        if(a*a==x) return a;
        else return a-1;
        }
    }
};
```

