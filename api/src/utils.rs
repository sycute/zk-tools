use std::hash::{DefaultHasher, Hash, Hasher};

pub fn str_to_u64(s: &str) -> u64 {
    let mut hasher = DefaultHasher::default();
    s.hash(&mut hasher);
    hasher.finish()
}
