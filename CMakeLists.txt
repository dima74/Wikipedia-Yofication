cmake_minimum_required(VERSION 3.6)
project(parse)

set(CMAKE_CXX_STANDARD 14)

set(SOURCE_FILES parser.cpp)
add_executable(parse ${SOURCE_FILES})