use yofication::dictionary::YowordInfo;
use yofication::yofication::Yofication;

#[global_allocator]
static ALLOC: jemallocator::Jemalloc = jemallocator::Jemalloc;

pub fn memory_usage() -> isize {
    jemalloc_ctl::epoch::advance().unwrap();
    jemalloc_ctl::stats::allocated::read().unwrap() as isize
}

fn print_difference(label: &str, start: isize, end: isize) {
    let bytes = start - end;
    let megabytes = bytes / 1024 / 1024;
    println!("{}: {} MB", label, megabytes);
}

fn main() {
    let mut yofication = Yofication::new().unwrap();
    print_yofication_statistics(&yofication);

    let memory1 = memory_usage();

    // let values = yofication.ewords.into_values().collect::<Vec<_>>();
    yofication.ewords.clear();

    let memory2 = memory_usage();
    print_difference("keys", memory1, memory2);

    drop(yofication);

    let memory3 = memory_usage();
    print_difference("values", memory2, memory3);
}

fn print_yofication_statistics(yofication: &Yofication) {
    let ewords = &yofication.ewords;
    let keys = ewords.keys();
    dbg!(ewords.len());
    dbg!(ewords.capacity());
    let keys_size: usize = keys.map(|k| k.len() * 2).sum();
    dbg!(keys_size);

    let values = ewords.values();
    let values_size: usize = values.map(|v| v.yoword.len() * 2).sum();
    dbg!(values_size);
    dbg!(std::mem::size_of::<YowordInfo>());
}
