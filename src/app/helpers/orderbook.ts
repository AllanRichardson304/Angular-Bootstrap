import { webSocket } from 'rxjs/webSocket';
import { AppInjector } from '../app.module';
import { FutureService } from '../services/future.service';
import { SpotService } from '../services/spot.service';
declare const convert: any;

const spotService = AppInjector.get(SpotService);
const fxService = AppInjector.get(FutureService);
var bitrueInterval:any = 0;
var sendMessage:any;

export const spotOrderbookData = (exchangename: any, symbol?: any) => {
	return new Promise<void>((resolve) => {
		const exchange: any = {
			bybit: async () => {
				spotService.kucoinOrderBook$ = webSocket('wss://stream.bybit.com/spot/public/v3');
				spotService.kucoinOrderBookData$ = await spotService.kucoinOrderBook$.asObservable();
				spotService.sendOrderBookMessage({
					"op": "subscribe",
					"args": [
						"orderbook.40." + symbol
					]
				}, 0);
				spotService.interval = setInterval(() => {
					spotService.kucoinOrderBook$.next({
						"op": "ping"
					})
				}, 20000)
				await spotService.kucoinOrderBookData$.subscribe({
					next: async (res: any) => {
						if (res['data']) {
							let orderBid: any = [];
							let orderAsk: any = [];
							await res.data['b'].forEach((element: any) => {
								orderBid.push({
									price: element[0],
									quantity: element[1],
									total: parseFloat(element[0]) * parseFloat(element[1]),
									percent: ((parseFloat(element[0]) * parseFloat(element[1])) / parseFloat(element[0])) * 100
								})
							});
							await res.data['a'].forEach((element: any) => {
								orderAsk.push({
									price: element[0],
									quantity: element[1],
									total: parseFloat(element[0]) * parseFloat(element[1]),
									percent: ((parseFloat(element[0]) * parseFloat(element[1])) / parseFloat(element[0])) * 100
								})
							});
							await spotService.orderbookData.next({ ask: orderAsk.slice(0, 5), bid: orderBid.slice(0, 5) })
						}
						resolve();
					}
				})
			},
			kucoin: async () => {
				spotService.kucoinOrderbookUrl().subscribe({
					next: async (res: any) => {
						if (res['success']) {
							spotService.kucoinOrderBook$ = webSocket(res?.data?.instanceServers[0].endpoint + '?token=' + res?.data?.token);
							spotService.kucoinOrderBookData$ = await spotService.kucoinOrderBook$.asObservable();
							spotService.sendOrderBookMessage(
								{
									"id": 1545910660739,
									"type": "subscribe",
									"topic": "/spotMarket/level2Depth5:" + symbol,
									"response": true
								}, res?.data?.instanceServers[0].pingInterval
							);
							await spotService.kucoinOrderBookData$.subscribe({
								next: async (msg: any) => {
									if (msg && msg.type == 'message') {
										let orderBid: any = [];
										let orderAsk: any = [];
										await msg.data['bids'].forEach((element: any) => {
											orderBid.push({
												price: element[0],
												quantity: element[1],
												total: parseFloat(element[0]) * parseFloat(element[1]),
												percent: ((parseFloat(element[0]) * parseFloat(element[1])) / parseFloat(element[0])) * 100
											})
										});
										await msg.data['asks'].forEach((element: any) => {
											orderAsk.push({
												price: element[0],
												quantity: element[1],
												total: parseFloat(element[0]) * parseFloat(element[1]),
												percent: ((parseFloat(element[0]) * parseFloat(element[1])) / parseFloat(element[0])) * 100
											})
										});
										await spotService.orderbookData.next({ ask: orderAsk, bid: orderBid })
									}
								}
							})
							resolve()
						}
					}
				})
			},
			bitrue: async () => {
				sendMessage = new WebSocket('wss://ws.bitrue.com/kline-api/ws');
				sendMessage.onopen = () => {
					sendMessage.send(JSON.stringify({
						"event": "sub", "params": { "channel": "market_" + symbol.toLowerCase() + "_depth_step0", "cb_id": symbol.toLowerCase() }
					}));
				}
				sendMessage.onmessage = async (msg: MessageEvent) => {
					let orderBid: any = [];
					let orderAsk: any = [];
					const reader = new FileReader();
					let text: any;
					reader.addEventListener('loadend', async () => {
						text = reader.result
						var uint8View = new Uint8Array(text);
						let data: any = await convert(uint8View);
						let finalData = JSON.parse(data);
						if (finalData?.tick) {
							await finalData?.tick['buys'].forEach((element: any) => {
								orderBid.push({
									price: element[0],
									quantity: element[1],
									total: parseFloat(element[0]) * parseFloat(element[1]),
									percent: ((parseFloat(element[0]) * parseFloat(element[1])) / parseFloat(element[0])) * 100
								})
							});
							await finalData?.tick['asks'].forEach((element: any) => {
								orderAsk.push({
									price: element[0],
									quantity: element[1],
									total: parseFloat(element[0]) * parseFloat(element[1]),
									percent: ((parseFloat(element[0]) * parseFloat(element[1])) / parseFloat(element[0])) * 100
								})
							});
							spotService.orderbookData.next({ ask: orderAsk.slice(0, 5), bid: orderBid.slice(0, 5) })
						}
					});
					reader.readAsArrayBuffer(msg.data);
				}
				resolve()
			}
		};
		return exchange[exchangename]()
	})
}

export const spotUnsubscribeorderbook = (exchangename: any, symbol: any) => {
	const exchangeUnsubscribe: any = {
		bybit: () => {
			spotService.sendOrderBookMessage(
				{
					"op": "unsubscribe",
					"args": [
						"orderbook.40." + symbol
					]
				}, 0
			);
			clearInterval(spotService.interval);
			spotService.kucoinOrderBook$.unsubscribe();
		},
		kucoin: () => {
			spotService.sendOrderBookMessage(
				{
					"id": 1545910660739,
					"type": "unsubscribe",
					"topic": "/spotMarket/level2Depth5:" + symbol,
					"response": true
				}, 0
			);
			clearInterval(spotService.interval);
			spotService.kucoinOrderBook$.unsubscribe()
		},
		bitrue:() => {
			sendMessage.send(JSON.stringify({
				"event": "unsub", "params": { "channel": "market_" + symbol.toLowerCase() + "_depth_step0", "cb_id": symbol.toLowerCase() }
			}));
			clearInterval(bitrueInterval);
		}
	};
	return exchangeUnsubscribe[exchangename]()
}

export const fxOrderbookData = (exchangename: any, symbol?: any) => {
	return new Promise<void>((resolve) => {
		const exchange: any = {
			bybit: () => {
				let orderBid: any = [];
				let orderAsk: any = [];
				fxService.fxkucoinOrderBook$ = webSocket('wss://stream.bybit.com/realtime_public');
				fxService.fxkucoinOrderBookData$ = fxService.fxkucoinOrderBook$.asObservable();
				fxService.sendFxOrderBookMessage({
					"op": "subscribe",
					"args": [
						"orderBookL2_25." + symbol
					]
				}, 0);
				fxService.interval = setInterval(() => {
					fxService.fxkucoinOrderBook$.next({
						"op": "ping"
					})
				}, 20000);
				fxService.fxkucoinOrderBookData$.subscribe({
					next: async (res: any) => {
						if (res && res.type == 'snapshot') {
							await res.data['order_book'].filter((e: any) => e.side == 'Buy').forEach((element: any) => {
								orderBid.push({
									price: element?.price,
									quantity: element.size,
									id: element.id
								})
							});
							await res.data['order_book'].filter((e: any) => e.side == 'Sell').forEach((element: any) => {
								orderAsk.push({
									price: element.price,
									quantity: element.size,
									id: element.id
								})
							});
							fxService.orderbookData.next({ ask: orderAsk.slice(-5).sort((a: any, b: any) => a.id - b.id), bid: orderBid.slice(-5).sort((a: any, b: any) => a.id - b.id) });
						}
						if (res && res.type == 'delta') {
							if (res.data.delete.length > 0) {
								res.data.delete.forEach((element: any) => {
									element.side == 'Buy' && orderBid.filter((t: any) => t.id != element.id);
									element.side == 'Sell' && orderAsk.filter((t: any) => t.id != element.id);
								});
								fxService.orderbookData.next({ ask: orderAsk.slice(0, 5).sort((a: any, b: any) => a.id - b.id), bid: orderBid.slice(0, 5).sort((a: any, b: any) => a.id - b.id) });
							}
							if (res.data.insert.length > 0) {
								res.data.insert.forEach((element: any) => {
									element.side == 'Buy' && orderBid.push({
										price: element.price,
										quantity: element.size,
										id: element.id
									});
									element.side == 'Sell' && orderAsk.push({
										price: element.price,
										quantity: element.size,
										id: element.id
									});
								});
								fxService.orderbookData.next({ ask: orderAsk.slice(0, 5).sort((a: any, b: any) => a.id - b.id), bid: orderBid.slice(0, 5).sort((a: any, b: any) => a.id - b.id) });
							}
							if (res.data.update.length > 0) {
								res?.data?.update.forEach((element: any) => {
									element.side == 'Buy' && orderBid.forEach((item: any) => {
										if (item.id == element.id) {
											item.price = element.price
											item.quantity = element.size
											item.id = element.id
										}
									});
									element.side == 'Sell' && orderAsk.forEach((item: any) => {
										if (item.id == element.id) {
											item.price = element.price
											item.quantity = element.size
											item.id = element.id
										}
									});
								});
								fxService.orderbookData.next({ ask: orderAsk.slice(0, 5).sort((a: any, b: any) => a.id - b.id), bid: orderBid.slice(0, 5).sort((a: any, b: any) => a.id - b.id) });
							}
							resolve();
						}
					}
				})
			},
			kucoin: async () => {
				fxService.kucoinOrderbookUrl().subscribe({
					next: async (res: any) => {
						if (res['success']) {
							fxService.fxkucoinOrderBook$ = webSocket(res?.data?.instanceServers[0].endpoint + '?token=' + res?.data?.token);
							fxService.fxkucoinOrderBookData$ = await fxService.fxkucoinOrderBook$.asObservable();
							fxService.sendFxOrderBookMessage(
								{
									"id": 1545910660740,
									"type": "subscribe",
									"topic": "/contractMarket/level2Depth5:" + symbol,
									"response": true
								}, res?.data?.instanceServers[0].pingInterval
							);
							await fxService.fxkucoinOrderBookData$.subscribe({
								next: async (msg: any) => {
									if (msg && msg.type == 'message') {
										let orderBid: any = [];
										let orderAsk: any = [];
										await msg.data['bids'].forEach((element: any) => {
											orderBid.push({
												price: element[0],
												quantity: element[1],
											})
										});
										await msg.data['asks'].forEach((element: any) => {
											orderAsk.push({
												price: element[0],
												quantity: element[1],
											})
										});
										await fxService.orderbookData.next({ ask: orderAsk, bid: orderBid })
									}
								}
							})
							resolve()
						}
					}
				})
			}
		};
		return exchange[exchangename]()
	})
}

export const fxUnsubscribeorderbook = (exchangename: any, symbol: any) => {
	const exchangeUnsubscribe: any = {
		bybit: () => {
			fxService.sendFxOrderBookMessage(
				{
					"op": "unsubscribe",
					"args": [
						"orderBookL2_25." + symbol
					]
				}, 0
			);
			clearInterval(fxService.interval);
			fxService.fxkucoinOrderBook$.unsubscribe();
		},
		kucoin: () => {
			fxService.sendFxOrderBookMessage(
				{
					"id": 1545910660739,
					"type": "unsubscribe",
					"topic": "/spotMarket/level2Depth5:" + symbol,
					"response": true
				}, 0
			);
			clearInterval(fxService.interval);
			fxService.fxkucoinOrderBook$.unsubscribe()
		}
	};
	return exchangeUnsubscribe[exchangename]()
}