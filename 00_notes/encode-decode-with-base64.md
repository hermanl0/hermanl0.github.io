# Encode and Decode with Base64

## Encoding with Base64

To encode a file using Base64, use the following command:

```bash
base64 -i example-config.txt > base64-encoded.txt
```

To view the encoded content, use:

```bash
more base64-encoded.txt
```

Example output:
```
Y29uZmlnIHRleHQK
```

## Decoding with Base64

To decode a Base64 encoded file, use the following command:

```bash
base64 -d -i base64-encoded.txt > base64-decoded.txt
```

To view the decoded content, use:

```bash
more base64-decoded.txt
```

Example output:
```
config text
```
