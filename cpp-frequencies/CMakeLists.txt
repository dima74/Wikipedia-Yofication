cmake_minimum_required(VERSION 3.6)
project(wikipedia-efication)

set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_FLAGS "-DLOCAL -g")
#set(CMAKE_CXX_FLAGS "-DLOCAL -O3")

add_subdirectory(fmt)

add_executable(converter src/converter.cpp)
add_executable(frequencies src/frequencies.cpp)
add_executable(all_ewords src/all_ewords.cpp)
add_executable(replaces_printer src/replaces_printer.cpp)
add_executable(replaces_printer_for_page src/replaces_printer_for_page.cpp)

include_directories(fmt)