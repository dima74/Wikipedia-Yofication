#include <bits/stdc++.h>
#include "yowords_parser.h"
using namespace std;

struct AllYowordsParser : public YowordsParser {
    void summary() {
        vector<YowordInfo> bests;
        for (pair<u16string, DwordInfo> p : infos) {
            YowordInfo best = p.second.getBest();
            if (best.number == best.numberAll) {
                bests.push_back(best);
            }
        }
        sort(bests.begin(), bests.end());
        for (YowordInfo best : bests) {
            cout << best << endl;
        }
    }
};

int main() {
//    freopen("results/ruwiki-my.txt", "r", stdin);
//    freopen("results/all-yowords.txt", "w", stdout);
    AllYowordsParser parser;
    TxtReader().readTo(parser);
    parser.summary();
    return 0;
}