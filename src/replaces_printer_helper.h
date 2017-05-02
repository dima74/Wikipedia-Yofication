#ifndef WIKIPEDIA_EFICATION_REPLACES_PRINTER_HELPER_H
#define WIKIPEDIA_EFICATION_REPLACES_PRINTER_HELPER_H

#include "replaces_creator.h"
#include "counter_number_russian_words.h"
#include "../lib/json.hpp"
using json = nlohmann::json;

json convertReplacesToJson(const vector<Replace> &replaces, const Page &page, ReplacesCreator &replacesCreator) {
	json info;
	info["title"] = page.title;
	info["revision"] = page.revision;
	json replacesJson = json::array();
	u16string text16 = to16(page.text);
	for (Replace replace : replaces) {
		size_t length = replace.eword.length();
		if (replace.indexWordStart == 0 || replace.indexWordStart + length == text16.length()) {
			continue;
		}

		u16string eword = replace.eword;
		u16string dword = text16.substr(replace.indexWordStart, length);

		size_t numberSameDwordsBefore = CounterNumberRussianWords::getNumberRussianWords(text16, dword, 0, replace.indexWordStart);
		size_t numberSameDwords = CounterNumberRussianWords::getNumberRussianWords(text16, dword);
		assert(numberSameDwords > 0);
		json replaceJson;
		replaceJson["indexWordStart"] = replace.indexWordStart;
		replaceJson["eword"] = to8(eword);
		replaceJson["numberSameDwordsBefore"] = numberSameDwordsBefore;
		replaceJson["numberSameDwords"] = numberSameDwords;
		replaceJson["frequency"] = lround(replacesCreator.ewords[eword].getFrequency() * 100);
		replacesJson.push_back(replaceJson);
	}
	info["replaces"] = replacesJson;
	return info;
}

#endif //WIKIPEDIA_EFICATION_REPLACES_PRINTER_HELPER_H
