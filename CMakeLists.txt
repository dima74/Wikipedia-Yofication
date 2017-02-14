cmake_minimum_required(VERSION 3.6)
project(parse)

set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_FLAGS "-DLOCAL -g")
#set(CMAKE_CXX_FLAGS "-DLOCAL -O3")

set(USE_SYSTEM_CURL ON)
set(BUILD_CPR_TESTS OFF)
add_subdirectory(cpr)
add_subdirectory(fmt)

add_executable(converter src/converter.cpp)
add_executable(frequencies src/frequencies.cpp)
add_executable(all_ewords src/all_ewords.cpp)
add_executable(efication src/efication.cpp)

include_directories(${CPR_INCLUDE_DIRS})
target_link_libraries(efication ${CPR_LIBRARIES})
include_directories(fmt)