#include <bits/stdc++.h>
#include "replaces_printer_helper.h"
#include "replaces_creator.h"
using namespace std;

int main() {
    float minReplaceFrequency;
    cin >> minReplaceFrequency;
    string line;
    getline(cin, line);

    ReplacesCreator replacesCreator(minReplaceFrequency);
    Page page;
    cin >> page;
    vector<Replace> replaces = replacesCreator.getReplaces(page);
    json replacesJson = convertReplacesToJson(replaces, page, replacesCreator);
    cout << replacesJson << endl;
    return 0;
}