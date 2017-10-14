#ifndef WIKIPEDIA_EFICATION_REPLACES_PRINTER_HELPER_H
#define WIKIPEDIA_EFICATION_REPLACES_PRINTER_HELPER_H

#include "../lib/json.hpp"
using json = nlohmann::json;
#include "replaces_creator.h"
#include "counter_number_russian_words.h"

json convertReplacesToJson(const vector<Replace> &replaces, const Page &page, ReplacesCreator &replacesCreator) {
	json info;
	info["title"] = page.title;
	info["revision"] = page.revision;
	json replacesJson = json::array();
	u16string text16 = to16(page.text);
	for (Replace replace : replaces) {
		size_t length = replace.yoword.length();
		if (replace.indexWordStart == 0 || replace.indexWordStart + length == text16.length()) {
			continue;
		}

		u16string yoword = replace.yoword;
		u16string dword = text16.substr(replace.indexWordStart, length);

		size_t numberSameDwordsBefore = CounterNumberRussianWords::getNumberRussianWords(text16, dword, 0, replace.indexWordStart);
		size_t numberSameDwords = CounterNumberRussianWords::getNumberRussianWords(text16, dword);
		assert(numberSameDwords > 0);
		json replaceJson;
		replaceJson["indexWordStart"] = replace.indexWordStart;
		replaceJson["yoword"] = to8(yoword);
		replaceJson["numberSameDwordsBefore"] = numberSameDwordsBefore;
		replaceJson["numberSameDwords"] = numberSameDwords;
		replaceJson["frequency"] = lround(replacesCreator.yowords[yoword].getFrequency() * 100);
		replacesJson.push_back(replaceJson);
	}
	info["replaces"] = replacesJson;
	return info;
}

#endif //WIKIPEDIA_EFICATION_REPLACES_PRINTER_HELPER_H
