'use client'
import { Button } from "@ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@ui/drawer";
export default function DataDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant={'secondary'} className="mx-4">Show Triangle</Button>
      </DrawerTrigger>
      <DrawerContent className="flex flex-col items-center justify-center">
        <DrawerHeader>
          <DrawerTitle>Data: auto.csv</DrawerTitle>
          <DrawerDescription>Yearly Aggregation</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="min-w-md">
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
