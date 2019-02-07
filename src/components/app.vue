<template>
	<v-app>
		<v-toolbar dark fixed app>
			<v-toolbar-title>Waves Quiz</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-tooltip bottom>
					<v-btn
						slot="activator"
						color=""
						dark
						flat
						icon
					>
						<v-icon>info</v-icon>
					</v-btn>
					<div class="body-1">
						Welcome to the Waves Platform Quiz<br/>
						To play You need the Waves Keeper installed<br/>
						Instructions:<br/>
						<ol>
							<li>Buy the tickets ({{ price }} tickets minimum, 1 WAVES per ticket)</li>
							<li>Answer the questions (all 10 ones)</li>
							<li>Send answers and get the prize</li>
						</ol>
						The first person wins
					</div>
				</v-tooltip>
				<v-spacer></v-spacer>
<!-- 				<v-tooltip bottom>
					<v-btn
						slot="activator"
						color=""
						dark
						flat
						icon
					>
						<v-icon small :color="status ? 'green' : 'red'">lens</v-icon>
					</v-btn>
					<div class="body-1">
						Start height: {{ startHeight }}<br/>
						Current height: {{ height }}
					</div>
				</v-tooltip> -->
				<v-btn flat :href="'https://wavesexplorer.com/address/' + quiz">{{ prize / 100000000.0 }} WAVES</v-btn>
			</v-toolbar>

			<v-content>
				<v-container>
					<v-dialog v-model="dialog.status" max-width="500px">
						<v-card>
							<v-layout column align-center>
							<v-card-title>
								<span v-html="dialog.text"></span>
								<v-spacer></v-spacer>
							</v-card-title>
							<v-card-actions>
								<v-btn depressed @click="dialog.status=false">Close</v-btn>
							</v-card-actions>
						</v-layout>
						</v-card>
					</v-dialog>
					<v-btn class="ml-0" depressed href="https://client.wavesplatform.com/dex?assetId1=WAVES&assetId2=ACr7tC6GwGH4WgtrXE3TGk9nCT45wv7k1C9HnuK9nvm" target="_blank">Buy tickets</v-btn>
					<v-btn depressed v-if="questions.length != 0" @click="sendAnswers">Send answers</v-btn>
					<v-progress-linear v-if="questions.length != 0" color="secondary" v-model="filled"></v-progress-linear>
					<v-template v-if="questions.length == 0">
						<span class="subtitle">
							Questions will be published after the game starts
						</span>
					</v-template>
					<v-layout column justify-center>
							<template v-for="(item, index) in questions">
							<v-flex xs12 sm12>
								<span
								>{{ index + 1 }} – {{item}}
								</span>
							</v-flex>
							<v-flex xs12 sm12>
								<v-text-field
								v-model="answers[index]"
								class="pt-0"
								single-line
								label=""
								></v-text-field>
							</v-flex>
						</template>
					</v-layout>
				</v-container>
			</v-content>
			<v-footer dark fixed app>
				<v-layout
				justify-center
				row
				wrap
				>
					<v-btn
					href="https://github.com/bodrych/waves-quiz"
					depressed
					>
					GitHub
					</v-btn>
					<v-btn
					href="https://chrome.google.com/webstore/detail/waves-keeper/lpilbniiabackdjcionkobglmddfbcjo"
					depressed
					>
					Waves Keeper
					</v-btn>
				</v-layout>
			</v-footer>
	</v-app>

</template>

<style scoped>
</style>

<script>
import api from '../api'
import utils from '../utils'

export default {
  name: 'Normal',
	data: () => {
		return {
			quiz: "3P2WGnT6N4n4GkoJDYTz2yvVwEMQQQqqqqt",
	  	node: "https://nodes.wavesplatform.com",
			quizPK: '8bE6aeC4zAQCgqRzjekWAiBZHxLgPRap4oXLnM1HKML1',
			// status: false,
			prize: 0,
			questions: [
				'Data transaction type number + set asset script transaction type number =',
				'What is the sigVerify id (after compilation)?',
				'The address corresponding to SEED phrase «produce pole person acid conduct embody develop spatial approve maze void venture achieve sample vintage»',
				'Maximum number of entries in data transaction',
				'Enter the generetion signature of the first Waves Platform blockchain block',
				'Smart asset is "match tx {case t: ExchangeTransaction => t.sellOrder.sender == t.buyOrder.sender case _ => false}". True or false for ExchangeTransaction?',
				'Decompile account script base64:AQMDBAAAAAckbWF0Y2gwBQAAAAJ0eAYGCQAB9AAAAAMIBQAAAAJ0eAAAAAlib2R5Qnl0ZXMJAAGRAAAAAggFAAAAAnR4AAAABnByb29mcwAAAAAAAAAAAAEAAAACCtEGB5MmlV0=',
				'Waves node application initial commit id',
				'How waves-wall.now.sh works without Waves Keeper? (enter the API name)',
				'Enter the hash of the previous 9 answers to the questions using the method of this site'
			],
			answers: [],
			publicState: {},
			price: 1,
			fee: 500000,
			// height: 0,
			// startHeight: 0,
			dialog: {
				status: false,
				text: ''
			}
		}
	},
	created: function() {
		this.update()
		this.getPrice()
		setInterval(this.update, 3000)
	},
	methods: {
		update: async function() {
			let balance = await api.getBalance(this.node, this.quiz)
			this.prize = balance
			// this.height = await api.getHeight(this.node)
			// this.startHeight = await api.getStartHeight(this.node, this.quiz)
			// this.status = (this.height >= this.startHeight) ? true : false
		},
		getPrice: async function() {
			let result = await api.getPrice(this.node, this.quiz)
			this.price = result
		},
		checkKeeper: function() {
			if (typeof Waves == 'undefined') {
				this.dialog.text = 'To play You need the Waves Keeper installed'
				this.dialog.status = true
			}
		},
		getPublicState: async function() {
			let state = await Waves.publicState()
			this.publicState = state
			return state
		},
		sendAnswers: async function() {
			await this.getPublicState()
			this.checkKeeper()
			if (this.publicState.network.code != 'W') {
				this.dialog.status = true
				this.dialog.text = 'Please switch network in Waves Keeper to Mainnet'
				return
			}
			let hash = utils.sha256.create()
			let answers = this.answers.join().toLowerCase().replace(/ /g, '')
			hash.update(answers)
			let params = {
				type: 4,
				data: {
					amount: {
						assetId: 'WAVES',
						tokens: String((this.prize - this.fee) / 100000000.0)
					},
					fee: {
						assetId: 'WAVES',
						tokens: String((this.fee) / 100000000.0)
					},
					recipient: this.publicState.account.address,
					attachment: hash.hex(),
					senderPublicKey: this.quizPK
				}
			}
			console.log(hash.hex())
			try {
				let res = await Waves.signAndPublishTransaction(params)
			} catch (err) {
				console.log(err)
			}
		}
	},
	computed: {
		filled: function() {
			let empties = this.answers.filter(word => word.length > 0).length /10;
			return empties * 100
		}
	}
}
</script>
