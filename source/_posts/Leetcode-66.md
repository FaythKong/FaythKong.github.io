---
title: Leetcode-66
author: FaythKong
tags: 
  - Leetcode
categories: 
  - Leetcode刷题
  - 简单
date: 2024-7-18
top: 98
---
## 66.加一
给定一个由 整数 组成的 非空 数组所表示的非负整数，在该数的基础上加一。最高位数字存放在数组的首位，数组中每个元素只存储单个数字。你可以假设除了整数 0 之外，这个整数不会以零开头。

示例 1：
输入：digits = [1,2,3]
输出：[1,2,4]
解释：输入数组表示数字 123。

示例 2：
输入：digits = [4,3,2,1]
输出：[4,3,2,2]
解释：输入数组表示数字 4321。

示例 3：
输入：digits = [0]
输出：[1]
### 思路
<!--more-->
题目中的解释没啥卵用，直接按照数组做就行了。
### 代码
``` bash
class Solution {
public:
    vector<int> plusOne(vector<int>& digits) {
        for(int i=digits.size()-1;i>=0;i--)
        {
            digits[i]++;
            if(digits[i]==10)
            {
                digits[i]=0;
            }
            else
            return digits;
        }
        digits.insert(digits.begin(),1);
        return digits;
    }
};
``` 
