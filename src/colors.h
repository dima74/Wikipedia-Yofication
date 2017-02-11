#ifndef PARSE_COLORS_H
#define PARSE_COLORS_H

#include <bits/stdc++.h>
using namespace std;

//    usage: cout << red << "red text" << def << endl;
struct MyColor {
    string modifier;

//    modifier:
//    "30 + <int>" for usual colors or
//    "30 + <int>;1" for bright colors
    MyColor(const string &modifier) : modifier(modifier) {}

    friend ostream &operator<<(ostream &out, MyColor color) {
        return out << "\033[" << color.modifier << "m";
    }
};

MyColor def("0");
MyColor black("30;1");
MyColor red("31;1");
MyColor green("32;1");
MyColor yellow("33;1");
MyColor blue("34;1");
MyColor magenta("35;1");
MyColor cyan("36;1");
MyColor white("37;1");

#endif //PARSE_COLORS_H
