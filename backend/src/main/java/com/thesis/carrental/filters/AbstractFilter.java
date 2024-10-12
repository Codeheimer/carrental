package com.thesis.carrental.filters;

import org.apache.commons.lang3.NotImplementedException;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public abstract class AbstractFilter implements Pageable {

    private int pageNumber;
    private int pageSize;

    private int totalPages;

    private long totalResult;

    public boolean isFilterEmpty(){
        throw new NotImplementedException();
    }

    @Override
    public int getPageNumber() {
        return pageNumber;
    }

    public void setPageNumber(final int pageNumber) {
        this.pageNumber = pageNumber;
    }

    @Override
    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(final int pageSize) {
        this.pageSize = pageSize;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(final int totalPages) {
        this.totalPages = totalPages;
    }

    public long getTotalResult() {
        return totalResult;
    }

    public void setTotalResult(final long totalResult) {
        this.totalResult = totalResult;
    }

    @Override
    public long getOffset() {
        return (long) pageNumber * pageSize;
    }

    @Override
    public Sort getSort() {
        return Sort.unsorted();
    }

    @Override
    public Pageable next() {
        throw new NotImplementedException();
    }

    @Override
    public Pageable previousOrFirst() {
        throw new NotImplementedException();
    }

    @Override
    public Pageable first() {
        throw new NotImplementedException();
    }

    @Override
    public Pageable withPage(final int pageNumber) {
        throw new NotImplementedException();
    }

    @Override
    public boolean hasPrevious() {
        return pageNumber > 0;
    }
}
