#include <iostream>
#include <fstream>
#include <cassert>
#include <vector>
#include <set>
using namespace std;

bool starts_with(string s, const string with) {
    return s.substr(0, with.length()) == with;
}

bool ends_with(string s, const string with) {
    return s.length() >= with.length() && s.substr(s.length() - with.length()) == with;
}

class WikipediaParser {
public:
    const string page = "  <page>";
    const string title_start = "    <title>";
    const string title_end = "</title>";
    const string text_start = "      <text xml:space=\"preserve\">";
    const string text_end = "</text>";

    ifstream in = ifstream("../ruwiki-20161201-pages-articles.xml");

    string get_title() {
        string line;
        while (getline(in, line)) {
            if (line == page) {
                string title;
                getline(in, title);
                assert(starts_with(title, title_start));
                return title.substr(title_start.length(), title.length() - title_start.length() - title_end.length());
            }
        }
        assert(0);
    }

    string get_text() {
        string line;
        while (getline(in, line)) {
            if (starts_with(line, text_start)) {
                string text = line.substr(text_start.length());
                if (ends_with(text, text_end)) {
                    return text.substr(0, text.length() - text_end.length());
                }
                while (getline(in, line)) {
                    if (ends_with(line, text_end)) {
                        text += "\n" + line.substr(0, line.length() - text_end.length());

                        while (text.front() == '\n') {
                            text = text.substr(1);
                        }
                        while (text.back() == '\n') {
                            text.pop_back();
                        }

                        return text;
                    } else {
                        text += "\n" + line;
                    }
                }
                assert(0);
            }
        }
        assert(0);
    }

    void parse() {
        int number_pages = 2000000;
        for (int ipage = 0; ipage < number_pages; ++ipage) {
            string title = get_title();
            string text = get_text();

            if (starts_with(text, "#redirect")
                || starts_with(text, "#Redirect")
                || starts_with(text, "#REdirect")
                || starts_with(text, "#REDIRECt")
                || starts_with(text, "#REDIRECT")
                || starts_with(text, " #REDIRECT")
                || starts_with(text, "  #REDIRECT")
                || starts_with(text, "#перенаправление")
                || starts_with(text, "#Перенаправление")
                || starts_with(text, "#ПЕРЕНАПРАВЛЕНИЕ")
                || ends_with(text, "{{disambig}}")
                || ends_with(text, "{{неоднозначность}}")
                || ends_with(text, "{{Неоднозначность}}")
                || ends_with(text, "{{многозначность}}")
                || ends_with(text, "{{Многозначность}}")
                || ends_with(text, "{{список однофамильцев}}")
                || ends_with(text, "{{Список однофамильцев-тёзок}}")
                || starts_with(title, "Википедия:")
                || starts_with(title, "MediaWiki:")
                || starts_with(title, "Категория:")
                || starts_with(title, "Файл:")
                || starts_with(title, "Шаблон:")
                || starts_with(title, "Портал:")
                || starts_with(title, "Проект:")
                    ) {
                continue;
            }
        }
    }
};

int main() {
    WikipediaParser().parse();
//    printf("%.3f seconds\n", clock() / float(CLOCKS_PER_SEC));
    return 0;
}