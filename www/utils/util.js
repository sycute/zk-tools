export function truncateString(str) {
    if(!str) return
    const headLength = 4;
    const tailLength = 4;
    const ellipsis = '...';
 
    if (str.length <= headLength + tailLength + ellipsis.length) {
        // 如果字符串长度太短，直接返回原字符串
        return str;
    }
 
    const head = str.slice(0, headLength);
    const tail = str.slice(-tailLength);
 
    return head + ellipsis + tail;
}
