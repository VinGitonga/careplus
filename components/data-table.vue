<script setup lang="ts" generic="TData, TValue">
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useVueTable, type ColumnDef, type ColumnFiltersState, type SortingState, type VisibilityState } from "@tanstack/vue-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-vue-next";
import { valueUpdater } from "@/utils";

interface IProps {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	showTopContent?: boolean;
	searchColumnFilter?: string;
	showPagination?: boolean;
	emptyData?: string;
}

const props = withDefaults(defineProps<IProps>(), {
	showPagination: true,
	showTopContent: true,
	emptyData: "No Results",
});

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref<Record<string, any>>();

const table = useVueTable({
	get data() {
		return props.data;
	},
	get columns() {
		return props.columns;
	},
	getCoreRowModel: getCoreRowModel(),
	getPaginationRowModel: getPaginationRowModel(),
	getSortedRowModel: getSortedRowModel(),
	getFilteredRowModel: getFilteredRowModel(),
	onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
	onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
	onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibility),
	onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelection),
	state: {
		get sorting() {
			return sorting.value;
		},
		get columnFilters() {
			return columnFilters.value;
		},
		get columnVisibility() {
			return columnVisibility.value;
		},
		get rowSelection() {
			return rowSelection.value;
		},
	},
});
</script>
<template>
	<div>
		<div class="flex items-center py-4" v-if="props.showTopContent">
			<Input
				class="max-w-sm"
				placeholder="Filter emails ..."
				:model-value="table.getColumn(props.searchColumnFilter!)?.getFilterValue() as string"
				@update:model-value="table.getColumn(props.searchColumnFilter!)?.setFilterValue($event)" />
			<DropdownMenu>
				<DropdownMenuTrigger as-child>
					<Button variant="outline" class="ml-auto">
						Columns
						<ChevronDown class="w-4 h-4 ml-2" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" class="font-inconsolata">
					<DropdownMenuCheckboxItem
						v-for="column in table.getAllColumns().filter((col) => col.getCanHide())"
						:key="column.id"
						class="capitalize"
						:checked="column.getIsVisible()"
						@update:checked="
							(val) => {
								column.toggleVisibility(!!val);
							}
						">
						{{ column.id }}
					</DropdownMenuCheckboxItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
		<div class="border rounded-lg">
			<Table>
				<TableHeader>
					<TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
						<TableHead v-for="header in headerGroup.headers" :key="header.id">
							<FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<template v-if="table.getRowModel().rows?.length">
						<template v-for="row in table.getRowModel().rows" :key="row.id">
							<TableRow :data-state="row.getIsSelected() ? 'selected' : undefined">
								<TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
									<FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
								</TableCell>
							</TableRow>
							<TableRow v-if="row.getIsExpanded()">
								<TableCell :colspan="row.getAllCells().length">
									{{ JSON.stringify(row.original) }}
								</TableCell>
							</TableRow>
						</template>
					</template>
					<template v-else>
						<TableRow>
							<TableCell :colspan="columns.length" class="h-24 text-center"> {{ props.emptyData }} </TableCell>
						</TableRow>
					</template>
				</TableBody>
			</Table>
		</div>
		<div class="flex items-center justify-end space-x-2 py-4">
			<div class="flex-1 text-sm text-muted-foreground">{{ table.getFilteredSelectedRowModel().rows.length }} of {{ table.getFilteredRowModel().rows.length }} row(s) selected</div>
		</div>
		<div v-if="props.showPagination" class="flex items-center justify-end py-4 space-x-2">
			<Button variant="outline" size="sm" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()"> Previous </Button>
			<Button variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()">Next</Button>
		</div>
	</div>
</template>
