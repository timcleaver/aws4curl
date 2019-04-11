export function parseHeader(header: string) {
  const headerParts = header.match(/(.*):\s(.*)/);
  if (!headerParts) {
    throw new Error(`Header "${header}" is not parsable`);
  }
  return {
    key: headerParts[1],
    value: headerParts[2]
  };
}

export function getHeaders(parsedArgs: any): object {
  let headers: { key: string; value: string }[] = [];
  if (parsedArgs.H) {
    if (Array.isArray(parsedArgs.H)) {
      headers.push(...parsedArgs.H.map(parseHeader));
    } else {
      headers.push(parseHeader(parsedArgs.H));
    }
  }
  if (parsedArgs.header) {
    if (Array.isArray(parsedArgs.header)) {
      headers.push(...parsedArgs.header.map(parseHeader));
    } else {
      headers.push(parseHeader(parsedArgs.header));
    }
  }

  return headers.reduce((headerMap: any, { key, value }: any) => {
    headerMap[key] = value;
    return headerMap;
  }, {});
}

export function getBody(parsedArgs: any): string | undefined {
  if (parsedArgs.d) {
    return parsedArgs.d;
  } else if (parsedArgs.data) {
    return parsedArgs.data;
  }
}

export function getMethod(parsedArgs: any): string | undefined {
  if (parsedArgs.X) {
    return parsedArgs.X;
  } else if (parsedArgs.request) {
    return parsedArgs.request;
  }
}
