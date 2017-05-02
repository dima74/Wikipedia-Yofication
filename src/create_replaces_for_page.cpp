#include <bits/stdc++.h>
#include "replaces_creator.h"
#include "replaces_printer_helper.h"
using namespace std;

int main() {
	ReplacesCreator replacesCreator;
	Page page;
	cin >> page;
	vector<Replace> replaces = replacesCreator.getReplaces(page);
	json replacesJson = convertReplacesToJson(replaces, page, replacesCreator);
	cout << replacesJson << endl;
	return 0;
}