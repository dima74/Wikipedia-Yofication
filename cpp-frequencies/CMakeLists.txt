cmake_minimum_required(VERSION 3.6)
project(wikipedia-efication)

set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_FLAGS "-DLOCAL -g")
#set(CMAKE_CXX_FLAGS "-DLOCAL -O3")

add_subdirectory(fmt)

add_executable(converter src/converter.cpp)
add_executable(frequencies src/frequencies.cpp)
add_executable(all_yowords src/all_yowords.cpp)
add_executable(all_pages src/all_pages.cpp)
add_executable(replaces_printer src/replaces_printer.cpp)
add_executable(replaces_printer_for_page src/replaces_printer_for_page.cpp)

# чтобы работал рефакторинг во всех .h файлах
# можно указать любой cpp файл
add_executable(fake src/all_pages.cpp src/alignment.h src/colors.h src/counter_number_russian_words.h src/other.h src/page.h src/replaces_checker.h src/replaces_creator.h src/replaces_exclusion.h src/replaces_printer_helper.h src/string_helper.h src/txt_reader.h src/u16string.h src/word_info.h src/yowords_parser.h src/base.h)

include_directories(fmt)