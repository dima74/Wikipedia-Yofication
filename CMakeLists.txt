cmake_minimum_required(VERSION 3.6)
project(parse)

set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_FLAGS "-DLOCAL -g")
#set(CMAKE_CXX_FLAGS "-DLOCAL -O3")

set(USE_SYSTEM_CURL ON)
set(BUILD_CPR_TESTS OFF)
add_subdirectory(cpr)
add_subdirectory(fmt)

#set(SOURCE_FILES src/converter.cpp src/string_helper.h src/page.h)
#set(SOURCE_FILES src/create_frequencies.cpp src/txt_reader.h src/word_info.h)
set(SOURCE_FILES src/parser.cpp src/u32string.h src/string_helper.h src/page.h src/txt_reader.h src/word_info.h)
add_executable(parse ${SOURCE_FILES})

include_directories(${CPR_INCLUDE_DIRS})
target_link_libraries(parse ${CPR_LIBRARIES})
include_directories(fmt)