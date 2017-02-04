#ifndef PARSE_COLORS_H
#define PARSE_COLORS_H

#include <bits/stdc++.h>
using namespace std;

//    usage: cout << red << "red text" << def << endl;
struct Color {
    string modifier;

//    modifier:
//    "30 + <int>" for usual colors or
//    "30 + <int>;1" for bright colors
    Color(const string &modifier) : modifier(modifier) {}

    friend ostream &operator<<(ostream &out, Color color) {
        return out << "\033[" << color.modifier << "m";
    }
};

Color def("0");
Color black("30;1");
Color red("31;1");
Color green("32;1");
Color yellow("33;1");
Color blue("34;1");
Color magenta("35;1");
Color cyan("36;1");
Color white("37;1");

#endif //PARSE_COLORS_H
