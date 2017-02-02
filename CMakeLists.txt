cmake_minimum_required(VERSION 3.6)
project(parse)

set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_FLAGS "-DLOCAL -g")

set(SOURCE_FILES parser.cpp u32string.h string_helper.h)
add_executable(parse ${SOURCE_FILES})