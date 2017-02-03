cmake_minimum_required(VERSION 3.6)
project(parse)

set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_FLAGS "-DLOCAL -g")
#set(CMAKE_CXX_FLAGS "-DLOCAL -O3")

set(SOURCE_FILES src/parser.cpp src/u32string.h src/string_helper.h src/page.h)
#set(SOURCE_FILES src/converter.cpp src/string_helper.h src/page.h)
add_executable(parse ${SOURCE_FILES})