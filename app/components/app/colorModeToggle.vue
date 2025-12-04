<script setup lang="ts">
	import { Moon, Sun, Monitor } from 'lucide-vue-next'

	const colorMode = useColorMode()
</script>

<template>
	<DropdownMenu>

		<DropdownMenuTrigger as-child>
			<Button variant="ghost" size="icon">
				<Monitor 
					v-if="colorMode.preference === 'system'" 
					class="h-[1.2rem] w-[1.2rem]" 
				/>
				<Moon 
					v-else-if="colorMode.value === 'dark'" 
					class="h-[1.2rem] w-[1.2rem]" 
				/>
				<Sun 
					v-else 
					class="h-[1.2rem] w-[1.2rem]" 
				/>
				<span class="sr-only">Cambiar tema</span>
			</Button>
		</DropdownMenuTrigger>

		<DropdownMenuContent align="end">
			<DropdownMenuItem @click="colorMode.preference = 'light'">
				<Sun class="mr-2 h-4 w-4" />
				<span>Claro</span>
			</DropdownMenuItem>
			<DropdownMenuItem @click="colorMode.preference = 'dark'">
				<Moon class="mr-2 h-4 w-4" />
				<span>Oscuro</span>
			</DropdownMenuItem>
			<DropdownMenuItem @click="colorMode.preference = 'system'">
				<Monitor class="mr-2 h-4 w-4" />
				<span>Sistema</span>
			</DropdownMenuItem>
		</DropdownMenuContent>

	</DropdownMenu>
</template>