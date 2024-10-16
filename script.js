

const conector = document.getElementById('conector')

conector.addEventListener('click', async () => {

	const port = await navigator.serial.requestPort();
	await port.open({ baudRate: 9600 });

	const textDecoder = new TextDecoderStream();
	const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
	const reader = textDecoder.readable.getReader();

	let str = [""]

	while (port.readable) {
		try {
			while (true) {
				const { value, done } = await reader.read();
				if (done) {
					// |reader| has been canceled.
					break;
				}

				for (let l of value) {
					if (l == "\n" || l == "\r") {
						change()
						str.push("")
					}
					else
						str[str.length-1] += l
				}
			}
		} catch (error) {
			// Handle |error|…
		} finally {
			reader.releaseLock();
		}
	}

	function change() {
		try {
			let json = JSON.parse(str[str.length-1])
			console.log(json)

			document.getElementById('r').textContent = json["r"]
			document.getElementById('g').textContent = json["g"]
			document.getElementById('b').textContent = json["b"]
			document.getElementById('a').textContent = json["a"]

		}
		catch(err) {

		}
	}

})
		